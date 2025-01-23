export const generateLinks = (id: string, resource: string) => {
    return [
      { rel: 'self', method: 'GET', href: `http://localhost:3000/${resource}/${id}` },
      { rel: 'update', method: 'PUT', href: `http://localhost:3000/${resource}/${id}` },
      { rel: 'delete', method: 'DELETE', href: `http://localhost:3000/${resource}/${id}` },
      { rel: 'list', method: 'GET', href: `http://localhost:3000/${resource}` },
      { rel: 'create', method: 'POST', href: `http://localhost:3000/${resource}` },
    ];
  };  