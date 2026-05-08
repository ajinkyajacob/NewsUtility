export default async function handler(req, res) {
  console.log('------------------------------');
  console.log('Incoming Request');

  try {
    const { endpoint, ...params } = req.query;

    console.log('Endpoint:', endpoint);
    console.log('Query Params:', params);

    if (!endpoint) {
      console.log('Missing endpoint');

      return res.status(400).json({
        error: 'endpoint is required',
      });
    }

    // Allow only specific NewsAPI endpoints
    const allowedEndpoints = [
      'v2/top-headlines',
      'v2/everything',
    ];

    if (!allowedEndpoints.includes(endpoint)) {
      console.log('Invalid endpoint:', endpoint);

      return res.status(403).json({
        error: 'Invalid endpoint',
      });
    }

    const queryString = new URLSearchParams(params).toString();

    const url =
      `https://newsapi.org/${endpoint}` +
      (queryString ? `?${queryString}` : '');

    console.log('Final URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': process.env.NEWS_API_KEY,
      },
    });

    console.log('NewsAPI Status:', response.status);

    const data = await response.json();

    console.log(
      'Articles Count:',
      data?.articles?.length || 0
    );

    if (!response.ok) {
      console.log('NewsAPI Error:', data);
    }

    res.status(response.status).json(data);

  } catch (error) {
    console.error('Server Error:', error);

    res.status(500).json({
      error: error.message,
    });
  }

  console.log('------------------------------');
}