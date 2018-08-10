TODO
====

1.  Inclusion of word cloud functionality?
  -   word cloud EDA
2.  Move actions page for downloading actions to dashboard
3.  Add word cloud pre-processing:
  -    spell-check (check out *hunspell* R package)
  -    stemming 
4.  Add interactive display of clustering algorithm results (rows: questions of a lab; columns: students; tiles calored according to (maximum a posteriori) cluster assignment 
  -   Need to be able to either specify number of clusters or let the algorithm choose according to some criterion (e.g., BIC)
  -   Use of von Mises mixture model; port to JavaScript? for now, provide R interface to receive document-term matrix and return a list of cluster assignments
5.  For dendograms, add hierarchical clustering with *minmax linkage*
