require 'bundler/setup'

require 'ostruct'
require 'sinatra'
require 'sinatra/synchrony'
require 'vimeo'

YAML::ENGINE.yamler= 'syck'

class Video < OpenStruct; end

class User < OpenStruct
  def exists?
    !!display_name
  end
end

get '/' do
  if params[:user]
    hsh = Vimeo::Simple::User.info(params[:user])
    unless hsh.has_key?('error')
      @user = User.new(hsh)

      ary = Vimeo::Simple::User.videos(params[:user])
      @videos = ary.map { |hsh| Video.new(hsh) }
    end
  end

  @user ||= User.new
  @videos ||= []

  @video_data = @videos.inject({}) do |a, e|
    a[e.id] = { :width  => e.width, :height => e.height }
    a
  end

  erb :index
end
