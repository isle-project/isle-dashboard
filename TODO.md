TODO
====

1.  Inclusion of word cloud functionality?
  -   word cloud EDA
2.  Move actions page for downloading actions to dashboard
3.  Add word cloud pre-processing:
  -    spell-check (check out *hunspell* R package)
  -    stemming 
4.  Add interactive display of clustering algorithm results (rows: questions of a lab; columns: students; tiles colored according to (maximum a posteriori) cluster assignment 
  -   Need to be able to either specify number of clusters or let the algorithm choose according to some criterion (e.g., BIC)
  -   Use of von Mises mixture model; port to JavaScript? for now, provide R interface to receive document-term matrix and return a list of cluster assignments
5.  For dendograms, add hierarchical clustering with *minmax linkage*
6.  Directory structure or keyword tagging for lessons? Make it easier to navigate a larger course

7. Completions:
  -   [LOW] Validation on the dropNLowest params when empty causes NaN's, ensure number
  -   [LOW] Generalize coverage to support patterns and types
  -   [LOW] Add 'metric_order' endpoint
  -   [MED] Add new rules and component refs to handle likely use case (progress, clicked link, watched video, ...)
  -   [HIGH] Adjust ACTION logging to update completions table
  -   [LOW] If a component is not available for any users, we ignore it; but if none are available in a metric,
      we should display blanks in the table rather than keeping the old values.
      1. CG will look at this and propose solutions
  -   [HIGH] Auto updating on recompute
      1. DONE return completion scores for each user from `compute_completions` endpoint (and associated data incl. metric, entityId) 
      2. PGB will update reducers
  -   [HIGH] Lessons version of modal (with drop down)
  -   [MED] Visualization of the relationships (ideas here)
  -   [MED] More salient namespace title on completions screen (among others)
