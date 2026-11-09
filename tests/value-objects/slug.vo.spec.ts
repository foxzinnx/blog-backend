import { Slug } from "@/domain/value-objects/slug.vo.js";
import { describe, expect, it } from "vitest";

describe('Slug VO', () => {
    describe('create', () => {
        it('should create a valid slug', () => {
            const slug = Slug.create('johndoe');

            expect(slug.value).toBe('johndoe');
        });

        it('should trim whitespace from the slug', () => {
            const slug = Slug.create('   John Doe  ');

            expect(slug.value).toBe('johndoe');
        })

        it('should normalize slug on creation', () => {
            const slug = Slug.create('John Doe');

            expect(slug.value).toBe('johndoe');
        });

        it('should accept a slug with exactly 3 characters', () => {
            const slug = Slug.create('joe');

            expect(slug.value).toBe('joe');
        });

        it('should accept a slug with exactly 50 characters', () => {
            const maxSlug = 'a'.repeat(50);
            const slug = Slug.create(maxSlug);

            expect(slug.value).toBe(maxSlug);
        })

        it('should throw when slug is empty', () => {
            expect(() => Slug.create('')).toThrow();
        });

        it('should throw when slug exceeds 50 characters', () => {
            const slug = 'a'.repeat(51);

            expect(() => Slug.create(slug)).toThrow();
        });
    });

    describe('equals', () => {
        it('should return true when two slugs have the same value', () => {
            const slug1 = Slug.create('johndoe');
            const slug2 = Slug.create('johndoe');

            expect(slug1.equals(slug2)).toBe(true);
        });

        it('should return false when two slugs are different', () => {
            const slug1 = Slug.create('johndoe');
            const slug2 = Slug.create('johndoe2');

            expect(slug1.equals(slug2)).toBe(false);
        })
    })
})