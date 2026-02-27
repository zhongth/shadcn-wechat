import { Command } from 'commander'
import { init } from './commands/init.js'
import { add } from './commands/add.js'
import { list } from './commands/list.js'
import { diff } from './commands/diff.js'

const program = new Command()

program
  .name('shadcn-wechat')
  .description('Add shadcn-style components to your Taro WeChat Mini Program')
  .version('0.0.1')

program
  .command('init')
  .description('Initialize your project with shadcn-wechat')
  .action(init)

program
  .command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Components to add')
  .option('-a, --all', 'Add all available components')
  .option('-o, --overwrite', 'Overwrite existing files')
  .action(add)

program
  .command('list')
  .description('List all available components')
  .action(list)

program
  .command('diff')
  .description('Compare local components with registry versions')
  .argument('[components...]', 'Components to diff (defaults to all installed)')
  .action(diff)

program.parse()
