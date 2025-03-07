# description

to make it faster to start a `electron + react + vite` project, I build current self-initial template.

# initial


```bash
$ npm i

```

# development

use the command below to start the development on local

```bash
$ npm run dev
```

# package 

use the command below to package current project into the exe files , and find the final exe file in the path of `/dist`


```bash
# for windows plantform
$ npm run package:win

# for macOS plantform
$ npm run package:mac

# for Linux plantform
$ npm run package:linux

```

# a little tips

> a litle tip before package:
 - to make the app works normally, you need add the packges into the `dependencies` before do the action of the packaging,
   even if you have added the packges into the `devDependencies`, but the packages here won't be packged into the final program, 
   so to make it, you need add the packges you need into the  `dependencies` of the `package.json`

 - when  the frontend `input` label's type was set as the `file`, the file can't be directly transfer into the backend `main.ts` as a `formData`,
   except that the you read the content of the file, and transfer it into the `bs64` inform or `binary` string datas, then you can get it via the bridge `preload.ts`




















