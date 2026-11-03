import { Comment } from "@/domain/entities/comment.entity.js";
import { Content } from "@/domain/value-objects/content.vo.js";
import { UniqueEntityId } from "@/domain/value-objects/unique-entity-id.vo.js";
import { describe, expect, it } from "vitest";

function makeCommentProps(overrides: Partial<{
    authorId: UniqueEntityId;
    postId: UniqueEntityId;
    content: Content;
}> = {}){
    return {
        authorId: overrides.authorId ?? new UniqueEntityId(),
        postId: overrides.postId ?? new UniqueEntityId(),
        content: overrides.content ?? Content.create('Este é um comentário')
    }
}

describe('Comment Entity', () => {
    describe('create', () => {
        it('should create a valid comment', () => {
            const authorId = new UniqueEntityId();
            const postId = new UniqueEntityId();
            const content = Content.create('Comentário novo');

            const comment = Comment.create({
                authorId,
                postId,
                content
            });

            expect(comment.id).toBeDefined();
            expect(comment.authorId).toBe(authorId);
            expect(comment.postId).toBe(postId);
            expect(comment.content.value).toBe('Comentário novo');
            expect(comment.createdAt).toBeInstanceOf(Date);
            expect(comment.updatedAt).toBeInstanceOf(Date);
        });

        it('should set createdAt and updatedAt on creation', () => {
            const before = new Date();
            const comment = Comment.create(makeCommentProps());
            const after = new Date();

            expect(comment.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(comment.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
            expect(comment.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(comment.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
        });

        it('should accept an optional id on creation', () => {
            const id = new UniqueEntityId();
            const comment = Comment.create(makeCommentProps(), id);

            expect(comment.id).toBe(id);
        });
    });

    describe('reconstitute', () => {
        it("should reconstitute a comment with existing props", () => {
        const id = new UniqueEntityId();
        const authorId = new UniqueEntityId();
        const postId = new UniqueEntityId();
        const content = Content.create("Comentário reconstituição");
        const createdAt = new Date("2024-01-01T10:00:00Z");
        const updatedAt = new Date("2024-01-02T12:00:00Z");

        const comment = Comment.reconstitute(
            {
                authorId,
                postId,
                content,
                createdAt,
                updatedAt,
            },
            id
        );

            expect(comment.id).toBe(id);
            expect(comment.authorId).toBe(authorId);
            expect(comment.postId).toBe(postId);
            expect(comment.content).toBe(content);
            expect(comment.createdAt).toBe(createdAt);
            expect(comment.updatedAt).toBe(updatedAt);
        });
    });

    describe("getters", () => {
        it("should return correct values from getters", () => {
            const authorId = new UniqueEntityId();
            const postId = new UniqueEntityId();
            const content = Content.create("Conteúdo do getter");

            const comment = Comment.create({
                authorId,
                postId,
                content,
            });

            expect(comment.authorId).toBe(authorId);
            expect(comment.postId).toBe(postId);
            expect(comment.content).toBe(content);
            expect(comment.createdAt).toBeInstanceOf(Date);
            expect(comment.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe("updateContent", () => {
        it("should update the content", () => {
            const comment = Comment.create(makeCommentProps());
            const newContent = Content.create("Conteúdo atualizado do comentário");

            comment.updateContent(newContent);

            expect(comment.content.value).toBe("Conteúdo atualizado do comentário");
        });

        it("should update updatedAt when content is changed", () => {
            const comment = Comment.create(makeCommentProps());
            const originalUpdatedAt = comment.updatedAt;

            const newContent = Content.create("Novo conteúdo");
            comment.updateContent(newContent);

            expect(comment.updatedAt.getTime()).toBeGreaterThanOrEqual(
                originalUpdatedAt.getTime()
            );
        });

        it("should allow multiple content updates", () => {
            const comment = Comment.create(makeCommentProps());

            comment.updateContent(Content.create("Primeira atualização"));
            expect(comment.content.value).toBe("Primeira atualização");

            comment.updateContent(Content.create("Segunda atualização"));
            expect(comment.content.value).toBe("Segunda atualização");
        });
    });

    describe("toOutputDTO", () => {
        it("should return a correct CommentOutputDTO", () => {
            const authorId = new UniqueEntityId();
            const postId = new UniqueEntityId();
            const content = Content.create("DTO test content");

            const comment = Comment.create({
                authorId,
                postId,
                content,
            });

            const dto = comment.toOutputDTO();

            expect(dto).toEqual({
                id: comment.id.value,
                authorId: authorId.value,
                postId: postId.value,
                content: "DTO test content",
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            });
        });

        it("should reflect updated content in the DTO", () => {
            const comment = Comment.create(makeCommentProps());
            comment.updateContent(Content.create("Conteúdo final"));

            const dto = comment.toOutputDTO();

            expect(dto.content).toBe("Conteúdo final");
            expect(dto.updatedAt).toBe(comment.updatedAt);
        });
    });
})