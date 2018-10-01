//make sure to export main, with the signature
export function main(el, service, imEntity, state, config) {

  //this query fetches GO terms and evidence codes associated with the given gene.
  var query = {
    "from": imEntity.class, //In this case, this should always be Gene, because
    // we configured this tool to display data on Gene report pages. It's still
    // better practice to use imEntity.class rather than hardcoding to gene -
    // consider a tool that worked for genes OR proteins, for example!
    "select": [
      "goAnnotation.ontologyTerm.name",
      "goAnnotation.evidence.code.code",
      "goAnnotation.evidence.code.name",
      "goAnnotation.ontologyTerm.namespace"
    ],
    "orderBy": [{
      "path": "goAnnotation.ontologyTerm.namespace",
      "direction": "ASC"
    }],
    "where": [{
      "path": imEntity.format, //this translates to id, based on our tool config.
      "op": "=",
      "value": imEntity.value // BlueGenes will pass this dynamically.
    }]
  };

  //fetch data using imjs, which is available on the window.
  var goTerms = new imjs.Service(service)
    .records(query)
    .then(function(response) {
      //process results so they're grouped by their namespaces
      var terms = resultsToNamespaceBuckets(response);
      // output the results into HTML and add to the element provided
      // in the head of the main method.
      el.innerHTML = buildVisualOutput(terms);
    });
}

/**
Given namespace-sorted terms, return an HTML list of each term with its evidence
code(s).
**/
function buildVisualOutput(terms) {
  var namespaces = Object.keys(terms),
    termUI = "<div>";
  //loop through the namespaces and create a header for each namespace
  namespaces.map(function(namespace) {
    termUI = termUI + "<div><h3>" + namespace + "</h3> <ul>";
    //loop through the terms in each namespace
    terms[namespace].map(function(result) {
      //create a new list entry for each GO term.
      termUI = termUI + "<li>" + result.ontologyTerm.name
      // we're also going to add the evidence codes for each GO term. Codes
      // are used to explain _why_ a given gene is annotation with a GO term.
      // Evidence codes come in an array (there could be more than one per GO
      // term), so we have to loop through them too.
      result.evidence.map(function(evidence) {
        //add a span for each evidence code.
        termUI = termUI + "<span class='evidencecode' title='" +
          evidence.code.name +
          "'>" + evidence.code.code + "</span>";
      });
      //close all the open elements so we have well-formed HTML.
      termUI = termUI + "</li>";
    });
    termUI = termUI + "</ul></div>"
  });
  return termUI;
}

/**
Given a set of InterMine results (GO terms associated with a single gene),
sort the terms by namespace and return the results sorted into named buckets.
**/
function resultsToNamespaceBuckets(response) {
  //we're going to sort our terms by namespace.
  //here's a var to store each type of term in...
  var terms = {
    molecular_function: [],
    cellular_component: [],
    biological_process: []
  };
  //iterate through the results and group them by namespace
  response[0].goAnnotation.map(function(result) {
    //we don't need to store anything except the details in ontologyterm
    //push each term into the correct box
    terms[result.ontologyTerm.namespace].push(result);
  });
  return terms;
}
