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
  -   [ ] <HIGH> Tag Weights Editor
  -   [ ] <HIGH> Integrate Tag Weights Editor into both metric modals
  -   [ ] <HIGH> Bug in Edit Lesson Metric Modal that requires two saves for changes
  -   [ ] <HIGH> Bug in Completions Page/Namespace data when you navigate to lesson metric, crashes
  -   [ ] <MED> Show provenances when clicking on scores
  -   [ ] <MED> Incorporate new metric json spec in rule parameter form,
                including tooltips with description, validation, and select for enum type.
  -   [ ] <MED> Add data for testing and demonstration
  -   [ ] <MED> Format dates in table and unify when receiving or computing
  -   [ ] <LOW> Generalize coverage to support patterns and types
  -   [ ] <LOW> Add 'metric_order' endpoint
  -   [ ] <LOW> More salient namespace title on completions screen (among others)
  -   [X] <MED> Renormalize tag weights at computation time
  -   [X] <MED> Add new rules and component refs to handle likely use case (progress, clicked link, watched video, ...)
  -   [X] <HIGH> Adjust ACTION logging to update completions table
  -   [X] <LOW> If a component is not available for any users, we ignore it; but if none are available in a metric,
      we should display blanks in the table rather than keeping the old values.
      1. [X] CG will look at this and propose solutions
      2. [X] Update completions to handle missing
  -   [X] <HIGH> Auto updating on recompute
      1. [X] return completion scores for each user from `compute_completions` endpoint (and associated data incl. metric, entityId) 
      2. [X] PGB will update reducers
  -   [X] <HIGH> Lessons version of modal (with drop down)
  -   [X] <LOW> More conveniently accessing tags associated with levels higher than lesson
  -   [X] completions.js changes
          1. [DONE] change array instances to objects { level, entity, score, time, [tag], provenance },
             where provenance is just children renamed and where tag is not included if it's the
             DEFAULT_TAG; when defined tag is a string for a pure node or a tag weights object
             when an aggregated node
          2. [DONE] Missingness determined by score and handle missing values in reduced and weighted
          3. [DONE] remove tagWeights from policyOptions (easing handling of tagWeights in the code)
          4. [DONE] No missing when no data as in empty [] returns below, but missing when real missing
          5. [DONE] Let rules return missing when all data is missing
          6. [DONE] Eliminate labels for rule.json spec, use values as labels
          7. [DONE] Add default and description to each parameter for rule.json spec
          8. [DONE] Remove score and time from cohorts/user object (but keep metricName) since they're already in instance
          9. [DONE] Double check that changes are consistent and check missing handling for desired behavior.
          A. [DONE] Consider returned shape from getBranchData; probably fine as is, but check

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

