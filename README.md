# grunt-combine

Token based search and replace functionality for [grunt](https://github.com/gruntjs/grunt/).

### Install

	$ npm install grunt-combine [-g]

### Use

	grunt.config({
		combine:{
			example:{
				input:"./input.js",
				output:"./output.js",
				tokens:[{
					token:"$1",
					file:"./file.js"
				},{
					token:"%2",
					string:"replacement string"
				},{
					token:"!3",
					file:"./file.txt"
				}]
			}
		}
	});

	grunt.loadNpmTask("grunt-combine");

	grunt.registerTask("default","combine:example");

### Options

* `input`  - *{ String }* The file containing the referenced tokens.
* `output` - *{ String }* The file that the task will output after completing.
* `tokens` - *{ Array }* Tokens to search for and replace with either a string or a file's contents.
	* `token`  - *{ String }* The string that will be searched for in the file.
	* `file`   - *{ String }* The file thats contents will replace the `token`
	* `string` - *{ String }* The string that will replace the `token`

### Example Grunt Files

* [monkeybars](https://github.com/mcgaryes/monkeybars/blob/master/build/grunt.js)