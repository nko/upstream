#!/usr/bin/env ruby

ENV['EXPRESS_ENV'] = 'test'
ENV['SKIP_UPDATE_VIEWS'] = 'true'

Dir[File.dirname(__FILE__) + '/test/*_test.js'].each do |file|
  puts "running #{file}"
  `expresso #{file}`
end