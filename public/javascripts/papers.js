;(function(){
  var x2js = new X2JS();

  window.pubmedSearch = function search(query, arg1, arg2) {
    var cb;
    var limit = 5000; // limit unless otherwise specified
    
    // handle args
    if ( typeof arg1 === 'function' ) {
      cb = arg1;
    }
    else if ( typeof arg1 === 'number' &&
              typeof arg2 === 'function' ) {
      limit = arg1.toString();
      cb = arg2;
    }
    else { return; } // invalid args
    
    
    _search(query, limit, function(err, ids) {
      if (err) { cb(err); return; }
      _getPapers(ids,cb);
    });
  };

  // search pubmed, returns a list of ids
  function _search(query, limit, cb) {
    query = query.replace(' ','+');
    var url = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax="+limit+"&term="+query;
    _contactServer(url, function(err,results) {
      if (err) { cb(err); return; }
      var ids = results.eSearchResult.IdList.Id;
      cb(false, ids);
    });
  }

  function _getPapers(ids, cb) {
    var url = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=xml&retmode=text&id="+ids.join(",");
    _contactServer(url, function(err, results) {
      if (err) { cb(err); return; }
      var paperObjs = results.PubmedArticleSet.PubmedArticle;
      // console.log(paperObjs);
      var formattedPapers = $.map(paperObjs, _formatPaper);
      cb(false, formattedPapers);
    });
  }

  // TODO
  // function _getPaperCitations(id) {
  //   "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?retmode=xml&dbfrom=pubmed&id=21379579&cmd=neighbor"
  // }

  // takes in paper objects from pubmed
  // and formats them for display in our project
  function _formatPaper(paperObj){
    var p = paperObj.MedlineCitation;
    var title = p.Article.ArticleTitle;
    var journal = p.Article.Journal.Title;
    var _date = p.Article.Journal.JournalIssue.PubDate;
    var pubDate = _date.Month + " " + _date.Year;
    var authors = $.map(p.Article.AuthorList.Author, function(a) {
      return a.ForeName + " " + a.LastName;
    });
    var id = p.PMID['__text'];

    return{
      'title': title,
      'journal': journal,
      'pub-date': pubDate,
      'authors': authors,
      'data-source': 'pubmed',
      'id': id
    };
  }

  // contacts the pubmed server
  function _contactServer(url, cb) {
    $(function(){
      $.ajax({
        url: url,
        //crossDomain:true,
        dataType: "text",
        
        success: function( response ) {
          var parsed = _parse(response);
          cb(false, _parse(response));
        },
        error: function( _, err ) {
          cb(err);
        }
      });
    });
  }

  function _parse(str) {
    return x2js.xml_str2json(str);
  }

})();