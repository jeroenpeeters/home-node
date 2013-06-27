jasmine = require 'jasmine-node'
sys = require 'sys'
for key in jasmine
  global[key] = jasmine[key]

isVerbose = true
showColors = true
coffee = true
###
process.argv.forEach (arg) ->
  switch arg
    when '--color' then showColors = true
    when '--noColor' then showColors = false
    when '--verbose' then isVerbose = true
    when '--coffee' then coffee = true
###
options = 
  specFolders : ['./tests/spec/']
  onComplete : (runner, log) ->
    if runner.results().failedCount == 0
      process.exit 0
    else
      process.exit 1
  isVerbose : true
  showColors : true
  regExpSpec : new RegExp(".(coffee)$", "i")

jasmine.executeSpecsInFolder(options)