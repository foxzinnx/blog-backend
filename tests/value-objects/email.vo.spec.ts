import { Email } from "@/domain/value-objects/email.vo.js";
import { describe, expect, it } from "vitest";

describe('Email VO', () => {
    describe('create', () => {
        it('should create a valid email', () => {
            const email = Email.create('john@gmail.com');

            expect(email.value).toBe('john@gmail.com');
        });

        it('should normalize email to lowercase', () => {
            const email = Email.create('JOHN@GMAIL.COM');

            expect(email.value).toBe('john@gmail.com');
        })

        it('should trim whitespace from the email', () => {
            const email = Email.create('    john@gmail.com   ');

            expect(email.value).toBe('john@gmail.com');
        });

        it('should return email domain correctly', () => {
            const email = Email.create('john@gmail.com');

            expect(email.domain).toBe('gmail.com');
        });

        it('should accept email with subdomain', () => {
            const email = Email.create('john@example.gmail.com');

            expect(email.value).toBe('john@example.gmail.com');
        });

        it('should accept email with plus sign', () => {
            const email = Email.create('john+test@gmail.com');

            expect(email.value).toBe('john+test@gmail.com');
        });

        it('should throw when email is empty', () => {
            expect(() => Email.create('')).toThrow();
        });

        it('should throw when email has no @', () => {
            expect(() => Email.create('johngmail.com')).toThrow();
        });

        it('should throw when email has no domain', () => {
            expect(() => Email.create('john@')).toThrow();
        });

        it('should throw when email starts with dot', () => {
            expect(() => Email.create('.john@gmail.com')).toThrow();
        });

        it('should throw when email has consecutive dots', () => {
            expect(() => Email.create('jo..hn@gmail.com')).toThrow();
        });
    });

    describe('equals', () => {
        it('should return true when two emails have same values', () => {
            const email1 = Email.create('john@gmail.com');
            const email2 = Email.create('john@gmail.com');

            expect(email1.equals(email2)).toBe(true);
        });

        it('should return false when two emails have different values', () => {
            const email1 = Email.create('john@gmail.com');
            const email2 = Email.create('john2@gmail.com');

            expect(email1.equals(email2)).toBe(false);
        });
    });
})