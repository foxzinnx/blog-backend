import { Bio } from "@/domain/value-objects/bio.vo.js";
import { describe, expect, it } from "vitest";

describe('Bio VO', () => {
    describe('create', () => {
        it('should create a valid bio', () => {
            const bio = Bio.create('Essa é minha bio');

            expect(bio.value).toBe('Essa é minha bio');
        });

        it('should accept bio with exactly 160 characters', () => {
            const maxBio = 'A'.repeat(160);
            const bio = Bio.create(maxBio);

            expect(bio.value).toBe(maxBio);
        });

        it('should accept bio with empty text', () => {
            const bio = Bio.create('');

            expect(bio.value).toBe('');
        });

        it('should throw when bio exceeds 160 characters', () => {
            const maxBio = 'A'.repeat(161);

            expect(() => Bio.create(maxBio)).toThrow();
        });
    });

    describe('equals', () => {
        it('should return true when two bios have the same values', () => {
            const bio1 = Bio.create('Bio');
            const bio2 = Bio.create('Bio');

            expect(bio1.equals(bio2)).toBe(true);
        });

        it('should return false when two bios have different values', () => {
            const bio1 = Bio.create('Bio 1');
            const bio2 = Bio.create('Bio 2');

            expect(bio1.equals(bio2)).toBe(false);
        });
    })
})