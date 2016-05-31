require "html-proofer"

task default: %w[test]

task :test do
  sh "bundle exec jekyll build"
  HTMLProofer.check_directory("./_site").run
end
