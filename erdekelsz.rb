require 'rubygems'
require 'sinatra'
require 'gadget'
require 'model'

set :raise_errors, true
set :logging, true

get '/' do
  haml :about
end

get '/gadget.xml' do
  haml :gadget
end

get '/test' do
  request.host
end


helpers do
  def gadget_content_tag(view = nil, &block)
    content = "\n  <![CDATA[\n"
    unless view.nil?
      partial = haml view
      partial.strip!.gsub!("\n", "\n    ")
      content << "    #{partial}\n"
    end
    if block_given?
      content << "    "
      content << capture_haml(&block).strip.gsub("\n", "\n    ")
      content << "\n"
    end
    content << "  ]]>\n"
    %{<Content type="html"#{" view=#{view}" if view}>#{content}</Content>}
  end
end
