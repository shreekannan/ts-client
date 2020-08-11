import {
    convertPairStringToMap,
    generateNonce,
    getFragments,
    humanReadableByteCount,
    parseLinkHeader,
} from '../../src/utilities/general';

describe('General Utilities', () => {
    beforeEach(() => {
        window.history.pushState({}, 'Empty', '');
    });

    describe('generateNonce', () => {
        it('should generate nonce', () => {
            let nonce = generateNonce();
            expect(typeof nonce).toBe('string');
            expect(nonce.length).toBe(40);
            const old_nonce = nonce;
            nonce = generateNonce(60);
            expect(nonce.length).toBe(60);
            expect(/[A-Za-z0-9]*/g.test(nonce)).toBeTruthy();
            nonce = generateNonce();
            expect(nonce).not.toBe(old_nonce);
        });
    });

    describe('convertPairStringToMap', () => {
        it('should covert string pairs into a dictionary', () => {
            expect(convertPairStringToMap('test=false')).toEqual({
                test: `false`,
            });
            expect(convertPairStringToMap('test=false&other=value')).toEqual({
                test: `false`,
                other: `value`,
            });
        });
    });

    describe('getFragments', () => {
        it('should convert URL hash into into a dictionary', () => {
            window.history.pushState({}, 'Test', `#test=false`);
            expect(getFragments()).toEqual({ test: `false` });
            window.history.pushState({}, 'Test', `#test=false&other=value`);
            expect(getFragments()).toEqual({ test: `false`, other: `value` });
        });

        it('should convert URL hash containing a search string into into a dictionary', () => {
            window.history.pushState({}, 'Test', `#test=false?not_test=true`);
            expect(getFragments()).toEqual({ not_test: `true`, test: 'false' });
            window.history.pushState(
                {},
                'Test',
                `#test=false?not_test=true&other=value`
            );
            expect(getFragments()).toEqual({
                not_test: `true`,
                test: 'false',
                other: `value`,
            });
        });

        it('should convert URL query into into a dictionary', () => {
            window.history.pushState({}, 'Test', `?test=false`);
            expect(getFragments()).toEqual({ test: `false` });
            window.history.pushState({}, 'Test', `?test=false&other=value`);
            expect(getFragments()).toEqual({ test: `false`, other: `value` });
        });

        it('should convert URL search containing a hash string into into a dictionary', () => {
            window.history.pushState({}, 'Test', `?test=false#not_test=true`);
            expect(getFragments()).toEqual({ not_test: `true`, test: 'false' });
            window.history.pushState(
                {},
                'Test',
                `?test=false#not_test=true&other=value`
            );
            expect(getFragments()).toEqual({
                not_test: `true`,
                test: 'false',
                other: `value`,
            });
        });
    });

    describe('parseLinkHeaders', () => {
        it('should get the URL', () => {
            const header = '<http://google.com/>; rel="next"';
            const map = parseLinkHeader(header);
            expect(map.next).toBe('http://google.com/');
        });
    });

    describe('humanReadableByteCount', () => {
        it('should generate display value correctly', () => {
            expect(humanReadableByteCount(234)).toBe('234 B');
            expect(humanReadableByteCount(23456)).toBe('22.91 KB');
            expect(humanReadableByteCount(23456789)).toBe('22.37 MB');
            expect(humanReadableByteCount(23456789012)).toBe('21.85 GB');
            expect(humanReadableByteCount(23456789012345)).toBe('21.33 TB');
        });
    });
});
