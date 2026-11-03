import { Post } from "@/domain/entities/post.entity.js";
import type { PostStatus } from "@/domain/enums/post-status.enum.js";
import { CannotArchiveDraftPostError } from "@/domain/errors/cannot-archive-draft-post.error.js";
import { CannotPublishArchivedPostError } from "@/domain/errors/cannot-publish-archived-post.error.js";
import { CannotUpdateArchivedPostError } from "@/domain/errors/cannot-update-archived-post.error.js";
import { InvalidStatusError } from "@/domain/errors/invalid-status.error.js";
import { Content } from "@/domain/value-objects/content.vo.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";
import { describe, expect, it } from "vitest";

function makePostProps(overrides: Partial<{
    authorId: UniqueEntityId,
    content: Content,
    status: PostStatus,
    publishedAt: Date | null,
}> = {}){
    return {
        authorId: overrides.authorId ?? new UniqueEntityId(),
        content: overrides.content ?? Content.create('Este é o conteúdo do meu post'),
        status: overrides.status ?? ('DRAFT' as PostStatus),
    }
}

describe('Post Entity', () => {
    describe('create', () => {
        it('should create a valid draft post', () => {
            const post = Post.create(makePostProps());

            expect(post.id.value).toBeDefined();
            expect(post.authorId.value).toBeDefined();
            expect(post.content.value).toBe('Este é o conteúdo do meu post');
            expect(post.status).toBe('DRAFT');
            expect(post.publishedAt).toBeNull();
        });

        it('should create a published post with publishedAt set', () => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));

            expect(post.status).toBe("PUBLISHED");
            expect(post.publishedAt).toBeInstanceOf(Date);
            expect(post.publishedAt).not.toBeNull();
        })

        it('should set createdAt and updatedAt on creation', () => {
            const before = new Date();
            const post = Post.create(makePostProps());
            const after = new Date();

            expect(post.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(post.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
            expect(post.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(post.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
        });
    });

    describe('reconstitute',() => {
        it('should reconstitute a post with existing props', () => {
            const id = new UniqueEntityId();
            const authorId = new UniqueEntityId();
            const content = Content.create('Conteúdo reconstituição');
            const createdAt = new Date("2026-01-01");
            const updatedAt = new Date("2026-01-02");
            const publishedAt = new Date("2026-01-01");

            const post = Post.reconstitute(
                {
                    authorId,
                    content,
                    status: "PUBLISHED",
                    publishedAt,
                    createdAt,
                    updatedAt
                },
                id
            );

            expect(post.id).toBe(id);
            expect(post.authorId).toBe(authorId);
            expect(post.content).toBe(content);
            expect(post.status).toBe("PUBLISHED");
            expect(post.createdAt).toBe(createdAt);
            expect(post.updatedAt).toBe(updatedAt);
        });
    });

    describe('status helpers', () => {
        it('should correctly identify draft status', () => {
            const post = Post.create(makePostProps({ status: "DRAFT" }));

            expect(post.isDraft()).toBe(true);
        });

        it('should correctly identify published status', () => {
            const post = Post.create(makePostProps({ status: "PUBLISHED" }));

            expect(post.isPublished()).toBe(true);
        });

        it('should correctly identify archived status', () => {
            const post = Post.create(makePostProps({ status: "PUBLISHED" }));

            post.archive();

            expect(post.isArchived()).toBe(true);
        });
    });

    describe('publish', () => {
        it('should publish a draft post', () => {
            const post = Post.create(makePostProps());

            post.publish();

            expect(post.status).toBe("PUBLISHED");
            expect(post.publishedAt).toBeInstanceOf(Date);
            expect(post.isPublished()).toBe(true);
        });

        it('should do nothing when publishing an already published post', () => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));
            const originalPublishedAt = post.publishedAt;
            const originalUpdatedAt = post.updatedAt;

            post.publish();

            expect(post.status).toBe("PUBLISHED");
            expect(post.publishedAt).toBe(originalPublishedAt);
            expect(post.updatedAt).toBe(originalUpdatedAt);
        });

        it('should throw CannotPublishArchivedPostError when trying to publish an archived post', () => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));
            post.archive();

            expect(() => post.publish()).toThrow(CannotPublishArchivedPostError);
        });
    });
    
    describe('archive', () => {
        it('should archive a published post', () => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));

            post.archive();

            expect(post.status).toBe("ARCHIVED");
            expect(post.isArchived()).toBe(true);
        });

        it('should throw CannotArchiveDraftPostError when trying to archive a draft post', () => {
            const post = Post.create(makePostProps({ status: 'DRAFT' }));

            expect(() => post.archive()).toThrow(CannotArchiveDraftPostError);
        });
    });

    describe('draft', () => {
        it('should change status to draft', () => {
            const post = Post.create(makePostProps({ status: "PUBLISHED" }));

            post.draft();

            expect(post.status).toBe("DRAFT");
            expect(post.isDraft()).toBe(true);
        });
    });

    describe('updateContent', () => {
        it('should update content of a draft post', () => {
            const post = Post.create(makePostProps({ status: 'DRAFT' }));
            const newContent = Content.create('Novo conteúdo de post');

            post.updateContent(newContent);

            expect(post.content.value).toBe('Novo conteúdo de post');
        });

        it('should update content of a published post', () => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));
            const newContent = Content.create('Conteúdo do post atualizado');

            post.updateContent(newContent);

            expect(post.content.value).toBe('Conteúdo do post atualizado');
        });

        it('should update updatedAt when content is changed', () => {
            const post = Post.create(makePostProps());
            const originalUpdatedAt = post.updatedAt;

            const newContent = Content.create('Novo conteúdo');
            post.updateContent(newContent);

            expect(post.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
        });

        it('should throw CannotUpdateArchivedPostError when trying to update an archived post', () => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));
            post.archive();

            const newContent = Content.create('Conteúdo atualizado');

            expect(() => post.updateContent(newContent)).toThrow(CannotUpdateArchivedPostError);
        });
    });

    describe('applyStatusChange', () => {
        it('should do nothing when new status is the same as current', () => {
            const post = Post.create(makePostProps({ status: 'DRAFT' }));
            const originalUpdatedAt = post.updatedAt;

            post.applyStatusChange(post, 'DRAFT');

            expect(post.status).toBe('DRAFT');
            expect(post.updatedAt).toBe(originalUpdatedAt);
        });

        it('should publish via applyStatusChange', () => {
            const post = Post.create(makePostProps({ status: 'DRAFT' }));

            post.applyStatusChange(post, 'PUBLISHED');

            expect(post.status).toBe('PUBLISHED');
            expect(post.isPublished()).toBe(true);
        });

        it('should archive via applyStatusChange',() => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));

            post.applyStatusChange(post, 'ARCHIVED');

            expect(post.status).toBe('ARCHIVED');
            expect(post.isArchived()).toBe(true);
        });

        it('should set to draft via applyStatusChange', () => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));

            post.applyStatusChange(post, 'DRAFT');

            expect(post.status).toBe('DRAFT');
            expect(post.isDraft()).toBe(true);
        });

        it('should throw CannotArchiveDraftPostError when applying ARCHIVED on a draft', () => {
            const post = Post.create(makePostProps({ status: 'DRAFT'}));

            expect(() => post.applyStatusChange(post, 'ARCHIVED')).toThrow(CannotArchiveDraftPostError);
        });

        it('should throw CannotPublishArchivedPostError when applying PUBLISHED on an archived post', () => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));
            post.archive();

            expect(() => post.applyStatusChange(post, 'PUBLISHED')).toThrow(CannotPublishArchivedPostError);
        });

        it('should throw InvalidStatusError for an invalid status', () => {
            const post = Post.create(makePostProps());

            expect(() => post.applyStatusChange(post, 'INVALID_STATUS' as PostStatus)).toThrow(InvalidStatusError);
        });
    });

    describe('toOutputDTO', () => {
        it('should return a correct PostOutputDTO', () => {
            const post = Post.create(makePostProps({ status: 'PUBLISHED' }));

            const dto = post.toOutputDTO();

            expect(dto).toEqual({
                id: post.id.value,
                authorId: post.authorId.value,
                content: post.content.value,
                status: "PUBLISHED",
                publishedAt: post.publishedAt,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            });
        });

        it('should return null publishedAt for draft posts', () => {
            const post = Post.create(makePostProps({ status: 'DRAFT' }));

            const dto = post.toOutputDTO();

            expect(dto.publishedAt).toBeNull();
            expect(dto.status).toBe('DRAFT');
        })
    })
})