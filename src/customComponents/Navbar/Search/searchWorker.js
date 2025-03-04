// search.worker.js
self.addEventListener('message', ({ data }) => {
    const { query, jobs } = data;
    const results = performSearch(query, jobs);
    self.postMessage(results);
});

const parseSalary = (salaryStr) => {
    if (!salaryStr) return { min: 0, max: 0 };
    
    // Handle Naukri format: "8-10 Lacs PA"
    const lacMatch = salaryStr.match(/(\d+)\s*-\s*(\d+)\s*lacs?/i);
    if (lacMatch) {
        return {
            min: parseInt(lacMatch[1]) * 100000,
            max: parseInt(lacMatch[2]) * 100000
        };
    }

    // Handle single value Lac: "15 LPA"
    const singleLac = salaryStr.match(/(\d+)\s*lacs?/i);
    if (singleLac) {
        const val = parseInt(singleLac[1]) * 100000;
        return { min: val, max: val };
    }

    // Handle Glassdoor format: "₹5T()"
    const glassdoorMatch = salaryStr.match(/₹(\d+)(k|t)/i);
    if (glassdoorMatch) {
        const multiplier = glassdoorMatch[2].toLowerCase() === 'k' ? 1000 : 100000;
        const val = parseInt(glassdoorMatch[1]) * multiplier;
        return { min: val, max: val };
    }

    // Handle numeric ranges without units
    const rangeMatch = salaryStr.match(/(\d+)\s*-\s*(\d+)/);
    if (rangeMatch) {
        return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
    }

    return { min: 0, max: 0 };
};

const parseExperience = (expStr) => {
    if (!expStr) return { min: 0, max: 0 };
    const rangeMatch = expStr.match(/(\d+)\s*-\s*(\d+)\s*yrs?/i);
    if (rangeMatch) return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
    
    const singleMatch = expStr.match(/(\d+)\s*yrs?/i);
    if (singleMatch) {
        const val = parseInt(singleMatch[1]);
        return { min: val, max: val };
    }
    return { min: 0, max: 0 };
};

const performSearch = (query, jobs) => {
    const processedQuery = query
        .toLowerCase()
        .replace(/jobs?(?: in| at| with| for)?/gi, '')
        .trim();

    // Extract special patterns
    const salaryReq = processedQuery.match(/(\d+)\s*(lpa|lacs?|l|cr|k|t)/i);
    const expReq = processedQuery.match(/(\d+)\+?\s*(years?|yrs?|y)/i);
    const locationReq = processedQuery.match(/(?:in|at|near)\s+([a-zA-Z]+)/i);
    const jobTypeReq = processedQuery.match(/(intern|internship|full\s*time|part\s*time)/i);

    return jobs.filter(job => {
        // 1. Salary Filtering
        if (salaryReq) {
            const [_, amount, unit] = salaryReq;
            const numericAmount = parseInt(amount);
            const jobSalary = parseSalary(job.salary);
            
            const targetSalary = unit.toLowerCase() === 'lac' || unit === 'lpa' ? 
                numericAmount * 100000 : 
                unit === 'k' ? numericAmount * 1000 : 
                numericAmount;

            if (jobSalary.max < targetSalary) return false;
        }

        // 2. Experience Filter
        if (expReq) {
            const exp = parseInt(expReq[1]);
            const jobExp = parseExperience(job.experience || '');
            if (jobExp.max < exp) return false;
        }

        // 3. Location Filter
        if (locationReq) {
            const locationQuery = locationReq[1].toLowerCase();
            const jobLocations = job.location.toLowerCase().split(/,\s*/);
            if (!jobLocations.some(loc => loc.includes(locationQuery))) return false;
        }

        // 4. Job Type Filter
        if (jobTypeReq) {
            const type = jobTypeReq[1].toLowerCase();
            const isIntern = job.title.toLowerCase().includes('intern') || 
                            (job.description || '').toLowerCase().includes('intern');
            
            if (type.includes('intern') && !isIntern) return false;
            if (type.includes('full') && !job.employmentType?.includes('full')) return false;
        }

        // 5. Keyword Search
        const searchText = `
            ${job.title}
            ${job.company}
            ${job.description}
            ${(job.tags || []).join(' ')}
            ${job.location}
        `.toLowerCase();

        const searchTerms = processedQuery
            .replace(/(\d+)\s*(lpa|lacs?|l|cr|k|t)/gi, '')
            .replace(/(\d+)\+?\s*(years?|yrs?|y)/gi, '')
            .replace(/(in|at|near)\s+[a-zA-Z]+/gi, '')
            .split(/\s+/)
            .filter(term => term.length > 2);

        return searchTerms.length === 0 || 
            searchTerms.some(term => searchText.includes(term));
    });
};