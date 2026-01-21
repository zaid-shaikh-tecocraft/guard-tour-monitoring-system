// Remove $, #, *
function removeSpecialChars(str) {
    if (!str) return str;
    return str.replace(/[$#*]/g, '');
}

// Convert DDMMYYYYHHMMSS → Date object
function parseDOT(dot) {
    const clean = removeSpecialChars(dot);
    if (!clean || clean.length !== 14) return null;

    const DD = clean.substring(0, 2);
    const MM = clean.substring(2, 4);
    const YYYY = clean.substring(4, 8);
    const HH = clean.substring(8, 10);
    const mm = clean.substring(10, 12);
    const SS = clean.substring(12, 14);

    const isoString = `${YYYY}-${MM}-${DD}T${HH}:${mm}:${SS}.000Z`;
    const parsed = new Date(isoString);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

module.exports = {
    removeSpecialChars,
    parseDOT
};
