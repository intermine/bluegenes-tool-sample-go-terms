//make sure to export main, with the signature
export function main (el, service, imEntity, state, config) {

  var query    = {
    "from": imEntity.class, //this should always be Gene, because we configured this tool to display data on Gene report pages.
    "select": [
      "goAnnotation.ontologyTerm.name",
      "goAnnotation.ontologyTerm.description",
      "goAnnotation.ontologyTerm.namespace"
    ],
    "orderBy": [
      {
        "path": "goAnnotation.ontologyTerm.namespace",
        "direction": "ASC"
      }
    ],
    "where": [
      {
        "path": imEntity.format, //this translates to id, based on our tool config.
        "op": "=",
        "value": imEntity.value  // BlueGenes will pass this dynamically.
      }
    ]
  };
    //fetch data using imjs, which is available on the window.
    var goTerms = new imjs.Service(service)
        .records(query)
        .then(function(response) {
          //we'll add more code here, but in the meantime, print the result to the console.
          console.log(response);
    });
}
