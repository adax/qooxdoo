# Qooxdoo Release Notes

## Noteable changes and new features
 - qx es6ify
 - allow super()
 - new High-Level-Communication API, including support for JSON-RPC and GraphQL (experimental)". Documantion is found [here](communication/README.md)
 - Accessibility is an important topic in modern web development in order to allow assistive technologies to better help people with disabilities. Qooxdoo now supports better integration of [WAI-ARIA](https://www.w3.org/TR/wai-aria-1.1/) and more keyboard accessibility.
Documentation is found [here](development/howto/accessibility.md)




## Breaking changes

- The `qx.library` config setting is no longer used by the
compiler. If you want to override the path to the framework
source, add the path to `compile.json`'s `libraries` array.

- `qx.ui.form.Slider` now works correctly in vertical orientation.
The maximum value is at the top of the slider and the minimal value
at the bottom. Before that, the 2 values were reversed 

- all flash supporting classes are removed - flash is dead since January 2020.

- `qx.ui.command.Group` fixed a bug where new `qx.ui.command.Command` added did
not set the `active` status of the group, thus staying active even if the group
was inactive.

-  Namespace `qx.io.remote` has  been removed from the framework and put into 
the package [`deprecated.qx.io.remote`](https://github.com/qooxdoo/deprecated.qx.io.remote).
You can reinstall it by executing `npx qx pkg install qooxdoo/deprecated.qx.io.remote`.
  

## Licensing and Open Source Ownership

As a team, we are a small group of experienced developers based around the world who use
Qooxdoo every day and have a vested interest in maintaining the project and keeping it strong.

All code is available at GitHub [https://github.com/qooxdoo](https://github.com/qooxdoo),
where we have published policies and rules on contributing; We actively encourage anyone to
submit Pull Requests to contribute to the project.

We chat in public on [Gitter](https://gitter.im/qooxdoo/qooxdoo) and answer questions
on [StackOverflow](https://stackoverflow.com/questions/tagged/qooxdoo)

And we have [exciting plans for the future](http://qooxdoo.org/documentation/#/roadmap)!

[Documentation](https://qooxdoo.org/documentation/#/development/contribute)


