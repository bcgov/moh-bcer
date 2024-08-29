function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var host = request.headers.host.value;
    var retailer_url = `https://${host}/retailer/`
    var portal_url = `https://${host}/portal/`

    // Redirect / to /retailer/ to match on-prem functionality. Add trailing slash to avoid /retailer#/ instead of /retailer/#/
    if (uri === '/' || uri === '/retailer') {
        var response = {
            statusCode: 302,
            statusDescription: 'Found',
            headers:
                { "location": { "value": retailer_url } }
            }

        return response;
    }
    // Add trailing slash to avoid /portal#/ instead of /portal/#/
    else if (uri === '/portal') {
        var response = {
            statusCode: 302,
            statusDescription: 'Found',
            headers:
                { "location": { "value": portal_url } }
            }

        return response;
    }
    // Check whether the URI is missing a file name.
    else if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // Check whether the URI is missing a file extension.
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}