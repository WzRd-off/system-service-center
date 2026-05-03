export const formatDate = (date) =>
  new Date(date).toLocaleDateString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('uk-UA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
