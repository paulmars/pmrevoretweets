require 'awesome_print'
require 'JSON'
require 'fileutils'
require 'date'

tweets = File.new("rawdata/tweet.js", 'r').read()
json_tweets = JSON.parse(tweets)

BASE_DIR = "src"
FileUtils.mkdir_p(BASE_DIR)

class Tweet

  def initialize(data)
    @data = data
    @tweetid = @data["id"]
  end

  def created_at
    @created_at ||= DateTime.parse(@data["created_at"])
  end

  def write_all
    path = BASE_DIR + "/tweetid"
    FileUtils.mkdir_p(path)
    file = File.new(path + '/' + @tweetid + ".json", 'w')
    file << @data.to_json
    file.close
  end

  def write_to_month
    path = BASE_DIR + "/date/#{self.created_at.year}/#{self.created_at.month.to_s.rjust(2, "0")}"
    FileUtils.mkdir_p(path)
    file = File.new(path + '/' + @tweetid + ".json", 'w')
    file << @data.to_json
    file.close
  end

  def write_words
    words = @data["full_text"].downcase.split(/[^a-z]+/).select { |e| e != '' }
    path = BASE_DIR + "/words"
    FileUtils.mkdir_p(path)

    words.each do |word|

      word_file = "#{path}/#{word.to_s}.json"
      contents = []
      if File.exist?(word_file)
        contents = JSON.parse(File.new(word_file, 'r').read)
      end
      contents.push(@tweetid)

      file = File.new(word_file, 'w')
      file << contents.uniq.to_json
      file.close
    end
  end

end

json_tweets.each_with_index do |json_tweet, index|
  tweet = Tweet.new(json_tweet["tweet"])
  ap index
  tweet.write_all
  tweet.write_to_month
  tweet.write_words
end; true

