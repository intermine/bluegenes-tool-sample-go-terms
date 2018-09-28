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

          var terms = resultsToNamespaceBuckets(response);

          var termUI = "";

          var namespaces = Object.keys(terms);

          namespaces.map(function (namespace){
            terms[namespace].map(function (result) {
              console.log("%cresult","border-bottom:chartreuse solid 3px;",result);
            });
          });

    });
}

function resultsToNamespaceBuckets(response) {
  //we're going to sort our terms by namespace.
  //here's a var to store each type of term in...
  var terms = {
    molecular_function : [],
    cellular_component : [],
    biological_process : []
  };
  //iterate through the results and group them by namespace
  response[0].goAnnotation.map(function(result){
    //we don't need to store anything except the details in ontologyterm
    var term = result.ontologyTerm;
    //push each term into the correct box
    terms[term.namespace].push(term);
  });
  return terms;
}
