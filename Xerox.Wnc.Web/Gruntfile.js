/// <binding AfterBuild='dev' />
/// />
/*
To install missing node modules for grunt, drop into a command prompt, point it to the web site and type:
    npm install
*/
module.exports = function (grunt) {

    var globalConfig = {
        app: [
            'Scripts/App/**/*.js',
            '!Scripts/App/Other/polyfills.js'
        ],
        libs: [
            'Scripts/Libs/jquery-3.6.0.slim.min.js',
            'Scripts/Libs/angular.min.js',
            'Scripts/Libs/angular-sanitize.min.js',
            'Scripts/Libs/angular-cookies.min.js',
            'Scripts/Libs/angular-ui-router.min.js',
            'Scripts/Libs/deferred-bootstrap.js',
            'Scripts/Libs/iscroll-probe.js',
            'Scripts/Libs/lodash.min.js',
            'Scripts/Libs/ui-bootstrap-custom-tpls-2.5.0.min.js',
            'Scripts/Libs/crypto-js-min.js',
            'Scripts/Libs/Xrx/**/*.js'
        ]
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        globalConfig: globalConfig,

        iife: {
            wrap: {
                options: {
                    useStrict: true,
                    prependSemicolon: false,
                    trimCode: true
                },
                files: {
                    'wwwroot/dist/wrapped-output.js': ['<%=globalConfig.app%>']
                }
            }
        },

        uglify: {

            // All the dev build tasks are separated so that we can have very modular watchers
            build_app: {
                options: {
                    sourceMap: false,
                    beautify: true,
                    mangle: false,
                    compress: false,
                    preserveComments: 'all'
                },
                files: {
                    'wwwroot/dist/app.min.js': ['wwwroot/dist/wrapped-output.js', 'wwwroot/dist/templates.js']
                }
            },
            build_libs: {
                options: {
                    sourceMap: false,
                    beautify: true,
                    mangle: false,
                    compress: false,
                    preserveComments: 'all'
                },
                files: {
                    'wwwroot/dist/libs.min.js': ['<%=globalConfig.libs%>']
                }
            },
            build_polyfills: {
                options: {
                    sourceMap: false,
                    beautify: true,
                    mangle: false,
                    compress: false,
                    preserveComments: 'all'
                },
                files: {
                    'wwwroot/dist/polyfills.min.js': ['Scripts/App/Other/polyfills.js']
                }
            },

            // We don't support watching for the cloud build so we only have one task to just build the whole thing
            build_cloud: {
                options: {
                    sourceMap: false,
                    mangle: false,
                    compress: true,
                    preserveComments: false
                },
                files: {
                    'wwwroot/dist/app.min.js': ['wwwroot/dist/wrapped-output.js', 'wwwroot/dist/templates.js'],
                    'wwwroot/dist/libs.min.js': ['<%=globalConfig.libs%>'],
                    'wwwroot/dist/polyfills.min.js': ['Scripts/App/Other/polyfills.js']
                }
            }
        },

        // To avoid multiple copies of the same imported files concat all our less into one huge file before we compile it.
        // Also, this breaks the 'import' paths on our individual .less files which is why we use the (optional) tag.
        // Technically we don't need to 'import' at all for this way of building to work but it enables visual studio intellisense
        concat: {
            less: {
                src: ['Scripts/App/Components/**/*.less', 'wwwroot/Content/Styles/**/*.less', 'Scripts/App/Directives/**/*.less'],
                dest: 'wwwroot/dist/combined.less'
            },
        },

        // Compile our combined .less file
        less: {
            options: {
                strictMath: true
            },
            gen: {
                files: {
                    'wwwroot/dist/out.css': 'wwwroot/dist/combined.less'
                }
            }
        },

        //
        // This task keeps watch of any files that change. When they are changed, the specified task is ran.
        // To start watching, open up a command prompt to this directory and type: grunt watch
        //
        watch: {
            app: {
                files: ['<%=globalConfig.app%>'],
                tasks: ['build_app']
            },
            templates: {
                files: ['Scripts/App/**/*.html'],
                tasks: ['build_app']
            },
            app_libs: {
                files: ['<%=globalConfig.libs%>'],
                tasks: ['uglify:build_libs']
            },
            polyfills: {
                files: ['Scripts/App/Other/polyfills.js'],
                tasks: ['uglify:build_dev_polyfills']
            },
            css: {
                files: ['wwwroot/Content/**/*.css'],
                tasks: ['cssmin:dev']
            },
            less: {
                files: ['Scripts/App/Components/**/*.less', 'wwwroot/Content/Styles/**/*.less', 'Scripts/App/Directives/**/*.less'],
                tasks: ['concat:less', 'less:gen', 'cssmin:dev']
            }
        },

        cssmin: {
            dev: {
                options: {
                    level: 0,
                    keepBreaks: true,
                    sourceMap: false,
                    root: 'wwwroot/dist'
                },
                files: [{
                    'wwwroot/dist/app.min.css': ['wwwroot/dist/out.css', 'wwwroot/Content/**/*.css']
                }]
            },
            prod: {
                options: {
                    level: 2
                },
                files: [{
                    'wwwroot/dist/app.min.css': ['wwwroot/dist/out.css', 'wwwroot/Content/**/*.css'],
                }]
            }
        },

        html2js: {
            options: {
                base: ''
            },
            main: {
                src: ['Scripts/App/Components/**/*.html'],
                dest: 'wwwroot/dist/templates.js'
            }
        }

        //clean: {
        //    junk: ['dist/*', '!dist/*.min.*']
        //}
    });

    //grunt.loadNpmTasks('grunt-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-iife');
    grunt.loadNpmTasks('grunt-html2js');

    var allTasks = ['iife:wrap',
        'html2js',
        'uglify:build_app',
        'uglify:build_libs',
        'uglify:build_polyfills',
        'concat:less',
        'less:gen',
        'cssmin:dev'
    ];

    var prodTasks = ['iife:wrap',
        'html2js',
        'uglify:build_cloud',
        'concat:less',
        'less:gen',
        'cssmin:prod'
    ];

    grunt.registerTask('build_app', ['iife:wrap', 'html2js', 'uglify:build_app']);

    grunt.registerTask('dev', allTasks);
    grunt.registerTask('prod', prodTasks);
    grunt.registerTask('css', ['concat:less', 'less:gen', 'cssmin:dev']);
    grunt.registerTask('template', ['ngtemplates:common']);
};