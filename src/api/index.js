export const getData = () => {
  return fetch('http://konuxdata.getsandbox.com/data')
    .then(response => response.json())
    .then(({ values }) => {
      return values;
    })
    .catch((error) => {
      console.log(error);
    });
}
