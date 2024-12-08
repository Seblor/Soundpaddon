# Soundpaddon

![Soundpaddon Logo](web/static/logo.svg)

Enhance your Soundpad experience with Soundpaddon.

## Table of Contents

- [Soundpaddon](#soundpaddon)
  - [Table of Contents](#table-of-contents)
  - [About](#about)
  - [Features](#features)
  - [Installation](#installation)
  - [Building the project](#building-the-project)
  - [Contributing](#contributing)
  - [License](#license)
  - [Support](#support)
  - [Shameless donation plug](#shameless-donation-plug)

## About

Soundpaddon is an addon for Soundpad that enhances your experience by providing additional features and integrations.

## Features

- Import sounds from YouTube videos
- Import sounds from various soundbanks
- Import all sounds found on a web page
- Pair your devices to control Soundpad
- Interactive mobile preview

## Installation

To install Soundpaddon, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/Seblor/Soundpaddon.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Soundpaddon
    ```
3. Install dependencies:
    ```sh
    cd ./web # Navigate to the web interface directory
    npm ci # Install the web interface dependencies

    cd ../desktop # Navigate to the desktop interface directory
    npm ci # Install the desktop interface dependencies
    ```

## Building the project

To build the project, run the following commands:

```sh
npm run build # Builds the web interface, copies it to the server directory, and transpiles the server
npm run package # Builds the project and creates an installer.
```

To create the application installer, run the following command:

```sh
npm run make
```

Some dependencies will most likely be needed, please refer to your specific error messages for more information as I did not record all dependencies I installed during this project (I sincerely welcome any help on this part).

## Contributing

All contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, join my [Discord server](https://support.soundpaddon.app).

## Shameless donation plug

If you like this project, consider supporting it by starring the repository or [buying me a coffee](https://www.buymeacoffee.com/seblor).
