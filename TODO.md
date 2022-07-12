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
  -   Validation on the drop lowest params when empty causes NaN's
  -   Do not save if no lessons are changed (e.g., creating new but no lessons selected)
  -   Odd coupling when adding selectedLessons to hash
  -   If all checked individually, All Lessons should be checked
  -   Completion table in the dashboard with the latest user data and recompute button
  -   Generalize coverage to support patterns and types
  -   Add 'metric_order' endpoint
  -   Add new rules and component refs to handle likely use case (progress, clicked link, watched video, ...)
  -   Adjust ACTION logging to update completions table
