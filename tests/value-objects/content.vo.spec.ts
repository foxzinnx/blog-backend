import { Content } from "@/domain/value-objects/content.vo.js";
import { describe, expect, it } from "vitest";

describe('Content VO', () => {
    describe('create', () => {
        it('should create a valid content', () => {
            const content = Content.create('Este é o conteúdo do meu post');

            expect(content.value).toBe('Este é o conteúdo do meu post');
        });

        it('should trim whitespace from the content', () => {
            const content = Content.create('   Este é o conteúdo do meu post   ');

            expect(content.value).toBe('Este é o conteúdo do meu post');
        });

        it('should accept content with exactly 60 characters', () => {
            const maxContent = 'A'.repeat(60);
            const content = Content.create(maxContent);

            expect(content.value).toBe(maxContent);
        });

        it('should accept content with exactly 1 character', () => {
            const content = Content.create('A');

            expect(content.value).toBe('A');
        })

        it('should throw when content is empty', () => {
            expect(() => Content.create('')).toThrow();
        });

        it('should throw when content exceeds 60 characters', () => {
            const maxContent = 'A'.repeat(61);

            expect(() => Content.create(maxContent)).toThrow();
        });
    });

    describe('equals', () => {
        it('should return true when two contents have the same values', () => {
            const content1 = Content.create('Conteúdo');
            const content2 = Content.create('Conteúdo');

            expect(content1.equals(content2)).toBe(true);
        });

        it('should return false when two contents have different values', () => {
            const content1 = Content.create('Conteúdo 1');
            const content2 = Content.create('Conteúdo 2');

            expect(content1.equals(content2)).toBe(false);
        });
    })
})