import warning from 'warning';

export function computeRootMargin({ threshold, axis }) {
    const margins = [threshold];
    const unit = threshold.match(/^-?\d*\.?\d+(px|%)$/) || [''];
    const value = `0${unit.pop()}`;
    if (axis === 'y') {
        margins.push(value);
    } else {
        margins.unshift(value);
    }
    return margins.join(' ');
}

export function getItemCount({ itemCount, items }, warnIfConflict) {
    const hasItemCount = typeof itemCount !== 'undefined';
    const hasItems = typeof items !== 'undefined';
    const defaultValue = 0;

    if (warnIfConflict) {
        warning(
            !(hasItemCount && hasItems),
            'ReactIntersectionList: cannot use itemCount and items props at the same time, choose one to determine the number of items to render.',
        );
    }

    if (hasItemCount) {
        return itemCount;
    }

    return hasItems ? items.length || items.size || defaultValue : defaultValue;
}

export function computeSize(pageSize, itemCount) {
    return Math.max(0, Math.min(pageSize, itemCount));
}
