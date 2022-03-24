

export const getDates = () => {
    const startOfDay = 'T00:00:00Z'
    const endOfDay = 'T23:59:59Z'
    const today = {
        start: new Date().toISOString().split('T')[0] + startOfDay,
        end: new Date().toISOString().split('T')[0] + endOfDay
    }
    
    let day = new Date()
    day.setDate(day.getDate() -1)
    day = day.toISOString().split('T')[0]


    let day1 = new Date()
    day1.setDate(day1.getDate() - 2)
    day1 = day1.toISOString().split('T')[0]

    const yesterday = {
        start: day + startOfDay,
        end: day + endOfDay,
    }
    
    return {
        today,
        yesterday,
        recently: day1 + endOfDay
    }
}