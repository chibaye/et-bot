export default {
    camelize: str => {
        const s = str.replace(/\W/g, '')
        return s.charAt(0).toLowerCase() + s.slice(1)
    },
    progress: (index, total) => console.table({
        'eToll Zambia': {
            status: (index !== total - 1) ? 'fetching' : 'complete',
            percent: ((100 * index) / total).toFixed() + '%',
            fetched: index + 1,
            total
        }
    })
}