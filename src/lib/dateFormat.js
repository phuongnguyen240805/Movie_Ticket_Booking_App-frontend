export const dateFormat = (date) => {
    const time = new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        weekday: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    return time;
};