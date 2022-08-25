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

7. Assessments:
  -   [ ] <HIGH> Add progress metric for each lesson
  -   [ ] <HIGH> New info tables actionable (scores, tags, extensions)
  -   [ ] <HIGH> Logging scores in pre-existing components
  -   [ ] <HIGH> Update translation keys
  -   [ ] <HIGH> Weird bug freezing edit lesson metric modal
-     [ ] <HIGH> Initialize activeComponents cache
-     [ ] <HIGH> Add multiples policy to metric UI and remove from compute modal
  -   [ ] <MED> Enter lots of data for testing through the UI
  -   [ ] <MED> validation of rule parameters
  -   [ ] <MED> edit_lesson_metric_modal: Unclicking shared rule after changing rule should leave lower rules at last shared value
  -   [ ] <LOW> Add 'metric_order' endpoint
  -   [ ] <LOW> Generalize coverage to support patterns and types
  -   [ ] <LOW> More salient namespace title on assessments screen (among others)
  -   [ ] <LOW> Make time filters relative to course start

Some potential changes:


1.   Definition of a 'term' course-wide (e.g., semester start and end) and 'academic year'.
     
     If so, could offer possible defaults for time restrictions; also calendar year.
