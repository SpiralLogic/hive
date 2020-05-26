const path = require('path');
module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended', 
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'plugin:jest/style'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'tsconfigRootDir': __dirname,
        'ecmaVersion': 2020,
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint',
        'jest'
    ],
    'rules': {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
    },
    'overrides': [
        {
            'files': [
                './src/**/*'
            ]
        }
    ],
    'settings': {
        'react': {
            'createClass': 'createReactClass',
            'pragma': 'React',
            'version': 'detect'
        },
        'propWrapperFunctions': [
            // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
            'forbidExtraProps',
            {
                'property': 'freeze',
                'object': 'Object'
            },
            {
                'property': 'myFavoriteWrapper'
            }
        ],
        'linkComponents': [
            'Hyperlink',
            {
                'name': 'Link',
                'linkAttribute': 'to'
            }
        ]
    }
}
