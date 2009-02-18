require 'rubygems'
require 'sinatra'
require 'sinatra/gadgeteer'
require 'gadget'
require 'model'

set :raise_errors, true
set :logging, true

get '/' do
  haml :about
end

get '/gadget.xml' do
  @title = request.query_string
  haml :gadget
end

get '/test' do
  params.inspect
end

get %r{/profiles/(.*)} do
  if os_viewer[:id] == os_owner[:id]
    @viewer = Profile.get(os_viewer[:id]) || Profile.new(:id => os_viewer[:id])
    @viewer.update_attributes(os_viewer, *@viewer.attributes.keys)
    haml :profile
  else
    haml :interest
  end
end

post %r{/profiles/(.*)} do
  params[:captures].first.inspect
end

get %r{/profiles/(.*)} do
  params[:captures].first.inspect
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
