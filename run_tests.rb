#!/usr/bin/env ruby

Dir[File.dirname(__FILE__) + '/test/*_test.js'].each do |file|
  puts "running #{file}"
  `expresso #{file}`
end