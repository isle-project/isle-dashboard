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
  -   [ ] <HIGH> Show provenances when clicking on scores
  -   [ ] <HIGH> Logging scores in pre-existing components
  -   [ ] <HIGH> Renaming and new lingo
  -   [X] <HIGH> Install translation keys for completion phrases
  -   [X] <HIGH> Default tag includes everything not explicitly weighted
  -   [X] <HIGH> Discuss semantics of component logging
  -   [ ] <MED> validation of rule parameters
  -   [ ] <MED> auto-compute
  -   [ ] <MED> edit_lesson_metric_modal: Unclicking shared rule after changing rule should leave lower rules at last shared value
  -   [ ] <LOW> Add 'metric_order' endpoint
  -   [ ] <LOW> Generalize coverage to support patterns and types
  -   [ ] <LOW> More salient namespace title on completions screen (among others)

Some potential changes:

  1. Language Changes (not tied to specific term)
     + completion -> assessment
     + ref -> submetric
     + use 'score' when referring to the numeric value
     + use 'instance' when referring to the [score, time, provenance] aggregate

  2. Provenance tracking in completions code
     Maintain a provenance tree as third item [score, time, provenance].
     Object has the form {level, entity, data} where level is a level string,
     entity is the id of the entity (e.g., component, lesson, ...) these data
     are from, and data is an array of child provenances.
     At the component (leaf) level, we have an array of instances.

     Include a missing singleton for each level to mark missing values.
     These are included in the provenances. If all are missing below,
     we just have the corresponding misssing value.
     (At component level, it will be an instanace; else one of these objects.)

  3. Add 'advanced' options for metric
     + Shared with Student? - boolean
     + Time Restriction - an optional time interval that intersects with any specified on computation
     + Missing Policy - whether to replace missing values with zero or ignore them  (could generalize but start with boolean)
     + Auto-Compute

  4. Definition of a 'term' course-wide (e.g., semester start and end)
     and 'academic year'.
     
     If so, could offer possible defaults for time restrictions; also calendar year.

  5. Include tag weighting in intermediate calculations?
     Is this desirable? How would we do it?  (Move weights back into metric...not great, quite complex)

  6. Lazy evaluation option in computation (use already computed results)

  7. Visualizer 
     Provenance data can be displayed for each user in table or tree form

  8. Systematize sharing structure in UI
     Have sharedMetric and sharedMetricComponents as state and track it all from there,
     allowing everything to be shared, but hiding unshared quantities

  9. Associated information from component into completions table; connection with grade.
     componentData; rules

