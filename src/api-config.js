let backendHost;

const hostname = window && window.location && window.location.hostname;

if(hostname === 'reactprodution.com') { //se o react for de production
  backendHost = 'https://api.realsite.com'; //chama a api de production
} else if(hostname === 'clini-react-staging.herokuapp.com') { //se o react for de staging
  backendHost = 'https://clini-api-staging.herokuapp.com';// chama a api de staging
} else if(/^qa/.test(hostname)) {
  backendHost = `https://api.${hostname}`;
} else {
  backendHost = process.env.REACT_APP_BACKEND_HOST || 'http://localhost:3001'; //se não chama a api do localhost
}

console.log(backendHost)

export const API_ROOT = `${backendHost}`;