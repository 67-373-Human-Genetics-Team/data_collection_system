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
    var url = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax=5000&term="+query;
    _contactServer(url, function(err,results) {
      if (err) { cb(err); return; }
      var allIds = results.eSearchResult.IdList.Id;
      _getTopPaperIds(allIds, limit, cb);
    });
  }

  function _getPapers(ids, cb) {
    var url = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=xml&retmode=text&id="+ids.join(",");
    _contactServer(url, function(err, results) {
      if (err) { cb(err); return; }
      var paperObjs = results.PubmedArticleSet.PubmedArticle;
      // console.log('paperObjs');
      // console.log(paperObjs);
      var formattedPapers = $.map(paperObjs, _formatPaper);
      cb(null, formattedPapers);
    });
  }

  function _getTopPaperIds(ids, limit, cb) {
    // console.log('here');
    async.sortBy(ids, function(id, asyncCB){
        
        _countCitations(id, function(err, count) {
          asyncCB(err,count*-1);
        });
    }, function(err,sortedIds){ // async result callback
        if (err) { cb(err); return; }
        var limited = sortedIds.slice(0,limit);
        cb(null, limited);
    } );
  }
  

  function _countCitations(id, cb) {
    var url = "http://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?retmode=xml&db=pubmed&dbfrom=pubmed&cmd=neighbor&id="+id;
    
    // how many times should we try looking for related papers before giving up
    var CONTACT_TIMES = 10;

    function contactManyTimes(times) {
      if (times >= CONTACT_TIMES) {
        console.log('failed to find citation count for paper after '+CONTACT_TIMES+' attempts');
        cb(null, 0); return;
      }
      _contactServer(url, function(err, result) {
        if (err) { cb(err); return; }
        // console.log(id, result);
        // var count = result.eLinkResults.LinkSet.
        var count = getCitedIn(result);
        if(count === undefined) { contactManyTimes(times+1); }
        else { cb(null, count); }
      });

    }

    function getCitedIn(result) {
      // console.log(result.eLinkResult.LinkSet);
      var linkSets = result.eLinkResult.LinkSet.LinkSetDb;
      if (linkSets === undefined) {return undefined;}
      // console.log("hereeee");
      var count;
      for(var i=0; i<linkSets.length; i++) {
        var set = linkSets[i];
        // console.log('here', set.LinkName);
        if (set.LinkName === 'pubmed_pubmed_citedin') {
          count = set['Link'].length;
        }
      }
      
      return count;
    }

    contactManyTimes(0);
  }

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
          cb(null, _parse(response));
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