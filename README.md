# Chill Server

This server is intended for use in development environments to support various frontend projects.

## Project Setup

To set up the Chill Server project, follow these steps:

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/chill-server.git
   ```
2. Navigate to the project directory:
   ```sh
   cd chill-server
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```

### Running the Server

To start the server, run:

```sh
npm start
```

The server should now be running at `http://localhost:4000`.

### Snippets

#### Manually running mutations
```ts
async function main() {
  await prisma.book.create({
    data: {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

### License

This project is licensed under the MIT License.
