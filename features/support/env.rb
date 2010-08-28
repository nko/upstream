require 'rubygems'
require 'json'
require 'capybara/cucumber'
require 'test/unit'
require 'test/unit/assertions'
include Test::Unit::Assertions
require 'httparty'

Capybara.app = nil
Capybara.app_host = 'http://127.0.0.1:3000'
Capybara.javascript_driver = :selenium
Capybara.default_driver = :selenium

Symbol.class_eval do
  def to_proc
    Proc.new{|object| object.send(self)}
  end
end unless :symbol.respond_to?(:to_proc)

def patiently(&block)
  cycles = 0
  begin
    yield
  rescue  => e
    cycles += 1
    sleep 0.1
    if cycles < 10
      retry 
    else
      raise e
    end
  end
end

Before do
  @db_name = 'w4lls_test'
  HTTParty.delete "http://127.0.0.1:5984/#{@db_name}" rescue nil
  HTTParty.put "http://127.0.0.1:5984/#{@db_name}"
  HTTParty.put Capybara.app_host + "/update_views"
end