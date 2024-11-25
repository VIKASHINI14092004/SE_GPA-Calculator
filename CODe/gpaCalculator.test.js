// gpaCalculator.test.js
const { calculateGPA } = require('./gpaCalculator');

test('calculateGPA with equal credits and perfect grades', () => {
    const subjects = [
        { credit: 3, gradePoints: 12 },
        { credit: 4, gradePoints: 16 },
    ];
    expect(calculateGPA(subjects)).toBeCloseTo(4.0, 2);
});

test('calculateGPA with varying credits', () => {
    const subjects = [
        { credit: 3, gradePoints: 9 },
        { credit: 4, gradePoints: 14 },
    ];
    expect(calculateGPA(subjects)).toBeCloseTo(3.285, 2);
});

