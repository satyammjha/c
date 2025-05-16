
let searchIndex = [];

self.addEventListener('message', ({ data }) => {
  if (data.type === 'INIT') {
    
    searchIndex = data.jobs.map(job => ({
      id: job.id,
      text: `${job.title} ${job.company} ${job.location} ${job.skills?.join(' ') || ''}`.toLowerCase()
    }));
    return;
  }

  if (data.type === 'SEARCH') {
    const query = data.query.toLowerCase().trim();
    if (!query) return self.postMessage([]);
    
    const terms = query.split(/\s+/);
    const results = data.jobs.filter((_, index) => 
      terms.every(term => searchIndex[index].text.includes(term))
    );

    self.postMessage(results.slice(0, 500));
  }
});