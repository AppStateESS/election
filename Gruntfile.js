module.exports = function(grunt) {

    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        concat: {
            admin: {
                src: [
                    'javascript/Mixin/build/Mixin.js',
                    'javascript/Mixin/build/Date.js',
                    'javascript/Admin/Election/build/script.js'
                ],
                dest: 'javascript/Admin/Election/build/concat.js'
            },
            listing: {
                src: [
                    'javascript/Mixin/build/Mixin.js',
                    'javascript/Mixin/build/Date.js',
                    'javascript/Admin/List/build/List.js'
                ],
                dest: 'javascript/Admin/List/build/concat.js'
            },
            user: {
                src: [
                    'javascript/Mixin/build/Mixin.js',
                    'javascript/User/build/Review.js',
                    'javascript/User/build/Referendum.js',
                    'javascript/User/build/Multiple.js',
                    'javascript/User/build/Single.js',
                    'javascript/User/build/Election.js'
                ],
                dest: 'javascript/User/build/concat.js'
            }
        },
        uglify: {
            admin: {
                files: {
                    'javascript/Admin/Election/build/script.min.js': 'javascript/Admin/Election/build/concat.js',
                    'javascript/Admin/List/build/script.min.js': 'javascript/Admin/List/build/concat.js'
                }
            },
            user: {
                files: {
                    'javascript/User/build/script.min.js': 'javascript/User/build/concat.js'
                }
            }
        },
        
        clean: {
            contents: ['javascript/Admin/Election/build/concat.js', 'javascript/Admin/List/build/concat.js', 'javascript/User/build/concat.js'],
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask("dist", ['concat', 'uglify', 'clean']);
};
