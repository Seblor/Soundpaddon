
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const customTheme: CustomThemeConfig = {
    name: 'custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "8px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "255 255 255",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #035396 
		"--color-primary-50": "217 229 239", // #d9e5ef
		"--color-primary-100": "205 221 234", // #cdddea
		"--color-primary-200": "192 212 229", // #c0d4e5
		"--color-primary-300": "154 186 213", // #9abad5
		"--color-primary-400": "79 135 182", // #4f87b6
		"--color-primary-500": "3 83 150", // #035396
		"--color-primary-600": "3 75 135", // #034b87
		"--color-primary-700": "2 62 113", // #023e71
		"--color-primary-800": "2 50 90", // #02325a
		"--color-primary-900": "1 41 74", // #01294a
		// secondary | #3777ae 
		"--color-secondary-50": "225 235 243", // #e1ebf3
		"--color-secondary-100": "215 228 239", // #d7e4ef
		"--color-secondary-200": "205 221 235", // #cdddeb
		"--color-secondary-300": "175 201 223", // #afc9df
		"--color-secondary-400": "115 160 198", // #73a0c6
		"--color-secondary-500": "55 119 174", // #3777ae
		"--color-secondary-600": "50 107 157", // #326b9d
		"--color-secondary-700": "41 89 131", // #295983
		"--color-secondary-800": "33 71 104", // #214768
		"--color-secondary-900": "27 58 85", // #1b3a55
		// tertiary | #032a49 
		"--color-tertiary-50": "217 223 228", // #d9dfe4
		"--color-tertiary-100": "205 212 219", // #cdd4db
		"--color-tertiary-200": "192 202 210", // #c0cad2
		"--color-tertiary-300": "154 170 182", // #9aaab6
		"--color-tertiary-400": "79 106 128", // #4f6a80
		"--color-tertiary-500": "3 42 73", // #032a49
		"--color-tertiary-600": "3 38 66", // #032642
		"--color-tertiary-700": "2 32 55", // #022037
		"--color-tertiary-800": "2 25 44", // #02192c
		"--color-tertiary-900": "1 21 36", // #011524
		// success | #84cc16 
		"--color-success-50": "237 247 220", // #edf7dc
		"--color-success-100": "230 245 208", // #e6f5d0
		"--color-success-200": "224 242 197", // #e0f2c5
		"--color-success-300": "206 235 162", // #ceeba2
		"--color-success-400": "169 219 92", // #a9db5c
		"--color-success-500": "132 204 22", // #84cc16
		"--color-success-600": "119 184 20", // #77b814
		"--color-success-700": "99 153 17", // #639911
		"--color-success-800": "79 122 13", // #4f7a0d
		"--color-success-900": "65 100 11", // #41640b
		// warning | #EAB308 
		"--color-warning-50": "252 244 218", // #fcf4da
		"--color-warning-100": "251 240 206", // #fbf0ce
		"--color-warning-200": "250 236 193", // #faecc1
		"--color-warning-300": "247 225 156", // #f7e19c
		"--color-warning-400": "240 202 82", // #f0ca52
		"--color-warning-500": "234 179 8", // #EAB308
		"--color-warning-600": "211 161 7", // #d3a107
		"--color-warning-700": "176 134 6", // #b08606
		"--color-warning-800": "140 107 5", // #8c6b05
		"--color-warning-900": "115 88 4", // #735804
		// error | #D41976 
		"--color-error-50": "249 221 234", // #f9ddea
		"--color-error-100": "246 209 228", // #f6d1e4
		"--color-error-200": "244 198 221", // #f4c6dd
		"--color-error-300": "238 163 200", // #eea3c8
		"--color-error-400": "225 94 159", // #e15e9f
		"--color-error-500": "212 25 118", // #D41976
		"--color-error-600": "191 23 106", // #bf176a
		"--color-error-700": "159 19 89", // #9f1359
		"--color-error-800": "127 15 71", // #7f0f47
		"--color-error-900": "104 12 58", // #680c3a
		// surface | #35436e 
		"--color-surface-50": "225 227 233", // #e1e3e9
		"--color-surface-100": "215 217 226", // #d7d9e2
		"--color-surface-200": "205 208 219", // #cdd0db
		"--color-surface-300": "174 180 197", // #aeb4c5
		"--color-surface-400": "114 123 154", // #727b9a
		"--color-surface-500": "53 67 110", // #35436e
		"--color-surface-600": "48 60 99", // #303c63
		"--color-surface-700": "40 50 83", // #283253
		"--color-surface-800": "32 40 66", // #202842
		"--color-surface-900": "26 33 54", // #1a2136
		
	}
}

export const customThemeDark: CustomThemeConfig = {
    name: 'custom-theme-dark',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #3b82f6 
		"--color-primary-50": "226 236 254", // #e2ecfe
		"--color-primary-100": "216 230 253", // #d8e6fd
		"--color-primary-200": "206 224 253", // #cee0fd
		"--color-primary-300": "177 205 251", // #b1cdfb
		"--color-primary-400": "118 168 249", // #76a8f9
		"--color-primary-500": "59 130 246", // #3b82f6
		"--color-primary-600": "53 117 221", // #3575dd
		"--color-primary-700": "44 98 185", // #2c62b9
		"--color-primary-800": "35 78 148", // #234e94
		"--color-primary-900": "29 64 121", // #1d4079
		// secondary | #4685af 
		"--color-secondary-50": "227 237 243", // #e3edf3
		"--color-secondary-100": "218 231 239", // #dae7ef
		"--color-secondary-200": "209 225 235", // #d1e1eb
		"--color-secondary-300": "181 206 223", // #b5cedf
		"--color-secondary-400": "126 170 199", // #7eaac7
		"--color-secondary-500": "70 133 175", // #4685af
		"--color-secondary-600": "63 120 158", // #3f789e
		"--color-secondary-700": "53 100 131", // #356483
		"--color-secondary-800": "42 80 105", // #2a5069
		"--color-secondary-900": "34 65 86", // #224156
		// tertiary | #c0b6b4 
		"--color-tertiary-50": "246 244 244", // #f6f4f4
		"--color-tertiary-100": "242 240 240", // #f2f0f0
		"--color-tertiary-200": "239 237 236", // #efedec
		"--color-tertiary-300": "230 226 225", // #e6e2e1
		"--color-tertiary-400": "211 204 203", // #d3cccb
		"--color-tertiary-500": "192 182 180", // #c0b6b4
		"--color-tertiary-600": "173 164 162", // #ada4a2
		"--color-tertiary-700": "144 137 135", // #908987
		"--color-tertiary-800": "115 109 108", // #736d6c
		"--color-tertiary-900": "94 89 88", // #5e5958
		// success | #c1dd97 
		"--color-success-50": "246 250 239", // #f6faef
		"--color-success-100": "243 248 234", // #f3f8ea
		"--color-success-200": "240 247 229", // #f0f7e5
		"--color-success-300": "230 241 213", // #e6f1d5
		"--color-success-400": "212 231 182", // #d4e7b6
		"--color-success-500": "193 221 151", // #c1dd97
		"--color-success-600": "174 199 136", // #aec788
		"--color-success-700": "145 166 113", // #91a671
		"--color-success-800": "116 133 91", // #74855b
		"--color-success-900": "95 108 74", // #5f6c4a
		// warning | #e4c25e 
		"--color-warning-50": "251 246 231", // #fbf6e7
		"--color-warning-100": "250 243 223", // #faf3df
		"--color-warning-200": "248 240 215", // #f8f0d7
		"--color-warning-300": "244 231 191", // #f4e7bf
		"--color-warning-400": "236 212 142", // #ecd48e
		"--color-warning-500": "228 194 94", // #e4c25e
		"--color-warning-600": "205 175 85", // #cdaf55
		"--color-warning-700": "171 146 71", // #ab9247
		"--color-warning-800": "137 116 56", // #897438
		"--color-warning-900": "112 95 46", // #705f2e
		// error | #d27f81 
		"--color-error-50": "248 236 236", // #f8ecec
		"--color-error-100": "246 229 230", // #f6e5e6
		"--color-error-200": "244 223 224", // #f4dfe0
		"--color-error-300": "237 204 205", // #edcccd
		"--color-error-400": "224 165 167", // #e0a5a7
		"--color-error-500": "210 127 129", // #d27f81
		"--color-error-600": "189 114 116", // #bd7274
		"--color-error-700": "158 95 97", // #9e5f61
		"--color-error-800": "126 76 77", // #7e4c4d
		"--color-error-900": "103 62 63", // #673e3f
		// surface | #2b2e40 
		"--color-surface-50": "223 224 226", // #dfe0e2
		"--color-surface-100": "213 213 217", // #d5d5d9
		"--color-surface-200": "202 203 207", // #cacbcf
		"--color-surface-300": "170 171 179", // #aaabb3
		"--color-surface-400": "107 109 121", // #6b6d79
		"--color-surface-500": "43 46 64", // #2b2e40
		"--color-surface-600": "39 41 58", // #27293a
		"--color-surface-700": "32 35 48", // #202330
		"--color-surface-800": "26 28 38", // #1a1c26
		"--color-surface-900": "21 23 31", // #15171f
		
	}
}

export const customThemeBlack: CustomThemeConfig = {
    name: 'custom-theme-black',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #3b82f6 
		"--color-primary-50": "226 236 254", // #e2ecfe
		"--color-primary-100": "216 230 253", // #d8e6fd
		"--color-primary-200": "206 224 253", // #cee0fd
		"--color-primary-300": "177 205 251", // #b1cdfb
		"--color-primary-400": "118 168 249", // #76a8f9
		"--color-primary-500": "59 130 246", // #3b82f6
		"--color-primary-600": "53 117 221", // #3575dd
		"--color-primary-700": "44 98 185", // #2c62b9
		"--color-primary-800": "35 78 148", // #234e94
		"--color-primary-900": "29 64 121", // #1d4079
		// secondary | #4685af 
		"--color-secondary-50": "227 237 243", // #e3edf3
		"--color-secondary-100": "218 231 239", // #dae7ef
		"--color-secondary-200": "209 225 235", // #d1e1eb
		"--color-secondary-300": "181 206 223", // #b5cedf
		"--color-secondary-400": "126 170 199", // #7eaac7
		"--color-secondary-500": "70 133 175", // #4685af
		"--color-secondary-600": "63 120 158", // #3f789e
		"--color-secondary-700": "53 100 131", // #356483
		"--color-secondary-800": "42 80 105", // #2a5069
		"--color-secondary-900": "34 65 86", // #224156
		// tertiary | #c0b6b4 
		"--color-tertiary-50": "246 244 244", // #f6f4f4
		"--color-tertiary-100": "242 240 240", // #f2f0f0
		"--color-tertiary-200": "239 237 236", // #efedec
		"--color-tertiary-300": "230 226 225", // #e6e2e1
		"--color-tertiary-400": "211 204 203", // #d3cccb
		"--color-tertiary-500": "192 182 180", // #c0b6b4
		"--color-tertiary-600": "173 164 162", // #ada4a2
		"--color-tertiary-700": "144 137 135", // #908987
		"--color-tertiary-800": "115 109 108", // #736d6c
		"--color-tertiary-900": "94 89 88", // #5e5958
		// success | #c1dd97 
		"--color-success-50": "246 250 239", // #f6faef
		"--color-success-100": "243 248 234", // #f3f8ea
		"--color-success-200": "240 247 229", // #f0f7e5
		"--color-success-300": "230 241 213", // #e6f1d5
		"--color-success-400": "212 231 182", // #d4e7b6
		"--color-success-500": "193 221 151", // #c1dd97
		"--color-success-600": "174 199 136", // #aec788
		"--color-success-700": "145 166 113", // #91a671
		"--color-success-800": "116 133 91", // #74855b
		"--color-success-900": "95 108 74", // #5f6c4a
		// warning | #e4c25e 
		"--color-warning-50": "251 246 231", // #fbf6e7
		"--color-warning-100": "250 243 223", // #faf3df
		"--color-warning-200": "248 240 215", // #f8f0d7
		"--color-warning-300": "244 231 191", // #f4e7bf
		"--color-warning-400": "236 212 142", // #ecd48e
		"--color-warning-500": "228 194 94", // #e4c25e
		"--color-warning-600": "205 175 85", // #cdaf55
		"--color-warning-700": "171 146 71", // #ab9247
		"--color-warning-800": "137 116 56", // #897438
		"--color-warning-900": "112 95 46", // #705f2e
		// error | #d27f81 
		"--color-error-50": "248 236 236", // #f8ecec
		"--color-error-100": "246 229 230", // #f6e5e6
		"--color-error-200": "244 223 224", // #f4dfe0
		"--color-error-300": "237 204 205", // #edcccd
		"--color-error-400": "224 165 167", // #e0a5a7
		"--color-error-500": "210 127 129", // #d27f81
		"--color-error-600": "189 114 116", // #bd7274
		"--color-error-700": "158 95 97", // #9e5f61
		"--color-error-800": "126 76 77", // #7e4c4d
		"--color-error-900": "103 62 63", // #673e3f
		// surface | #000000 
		"--color-surface-50": "217 217 217", // #d9d9d9
		"--color-surface-100": "204 204 204", // #cccccc
		"--color-surface-200": "191 191 191", // #bfbfbf
		"--color-surface-300": "153 153 153", // #999999
		"--color-surface-400": "77 77 77", // #4d4d4d
		"--color-surface-500": "0 0 0", // #000000
		"--color-surface-600": "0 0 0", // #000000
		"--color-surface-700": "0 0 0", // #000000
		"--color-surface-800": "0 0 0", // #000000
		"--color-surface-900": "0 0 0", // #000000
		
	}
}