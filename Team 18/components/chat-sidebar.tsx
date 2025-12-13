'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  MessageSquare,
  PlusCircle,
  Trash2,
  ServerIcon,
  Settings,
  Sparkles,
  ChevronsUpDown,
  Copy,
  Pencil,
  Github,
  Key,
} from 'lucide-react';
import { CoffeeIcon } from './icons';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import { MCPServerManager } from './mcp-server-manager';
import { ApiKeyManager } from './api-key-manager';
import { ThemeToggle } from './theme-toggle';
import { getUserId, updateUserId, getUserName, updateUserName } from '@/lib/user-id';
import { useChats } from '@/lib/hooks/use-chats';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { appConfig } from '@/config/app';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMCP } from '@/lib/context/mcp-context';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatePresence, motion } from 'motion/react';

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [mcpSettingsOpen, setMcpSettingsOpen] = useState(false);
  const [apiKeySettingsOpen, setApiKeySettingsOpen] = useState(false);
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const [editUserNameOpen, setEditUserNameOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  // Get MCP server data from context
  const { mcpServers, setMcpServers, selectedMcpServers, setSelectedMcpServers } = useMCP();

  // Initialize userId and userName
  useEffect(() => {
    setUserId(getUserId());
    setUserName(getUserName());
  }, []);

  // Use TanStack Query to fetch chats
  const { chats, isLoading, deleteChat, refreshChats } = useChats(userId);

  // Start a new chat
  const handleNewChat = () => {
    router.push('/chat');
  };

  // Delete a chat
  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    deleteChat(chatId);

    // If we're currently on the deleted chat's page, navigate to home
    if (pathname === `/chat/${chatId}`) {
      router.push('/');
    }
  };

  // Get active MCP servers status
  const activeServersCount = selectedMcpServers.length;

  // Handle user name update
  const handleUpdateUserName = () => {
    if (!newUserName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    updateUserName(newUserName.trim());
    setUserName(newUserName.trim());
    setEditUserNameOpen(false);
    toast.success('Name updated successfully');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userName) return 'GU'; // Guest User
    const names = userName.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  // Add a helper function to format dates
  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Invalid date';
      }

      // Check if the date is today
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();

      // Check if the date is this year
      const isThisYear = date.getFullYear() === today.getFullYear();

      if (isToday) {
        // For today, show the time
        return `Today at ${date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}`;
      } else if (isThisYear) {
        // Format as "MMM DD at HH:MM" (e.g., "Jan 15 at 2:30 PM")
        return (
          date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }) +
          ' at ' +
          date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })
        );
      } else {
        // Format as "MMM DD, YYYY at HH:MM" (e.g., "Jan 15, 2023 at 2:30 PM")
        return (
          date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }) +
          ' at ' +
          date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })
        );
      }
    } catch (error) {
      console.error('Error formatting date:', error, 'Date string:', dateString);
      return 'Invalid date';
    }
  };

  // Show loading state if user ID is not yet initialized
  if (!userId) {
    return null; // Or a loading spinner
  }

  // Create chat loading skeletons
  const renderChatSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <SidebarMenuItem key={`skeleton-${index}`}>
          <div
            className={`flex items-center gap-2 px-3 py-2 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Skeleton className="h-4 w-4 rounded-full" />
            {!isCollapsed && (
              <>
                <Skeleton className="h-4 w-full max-w-[180px]" />
                <Skeleton className="h-5 w-5 ml-auto rounded-md flex-shrink-0" />
              </>
            )}
          </div>
        </SidebarMenuItem>
      ));
  };

  return (
    <Sidebar
      className="shadow-sm bg-background/80 dark:bg-background/40 ocean:bg-background/40 backdrop-blur-md"
      collapsible="icon"
    >
      <SidebarHeader className="p-4 border-b border-border/40">
        <div className="flex items-center justify-start">
          <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <div
              className={`relative rounded-full bg-primary/70 flex items-center justify-center ${
                isCollapsed ? 'size-5 p-3' : 'size-6'
              }`}
            >
              <Sparkles
                className={`${isCollapsed ? 'h-4 w-4' : 'h-5 w-5'} text-primary-foreground`}
              />
            </div>
            {!isCollapsed && (
              <div className="font-semibold text-lg text-foreground/90">
                {appConfig.company.name}
              </div>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-[calc(100vh-8rem)]">
        <SidebarGroup className="flex-1 min-h-0">
          <SidebarGroupLabel
            className={cn(
              'px-4 text-xs font-medium text-muted-foreground/80 uppercase tracking-wider',
              isCollapsed ? 'sr-only' : ''
            )}
          >
            Chats
          </SidebarGroupLabel>
          <SidebarGroupContent
            className={cn('overflow-y-auto pt-1', isCollapsed ? 'overflow-x-hidden' : '')}
          >
            <SidebarMenu>
              {isLoading ? (
                renderChatSkeletons()
              ) : chats.length === 0 ? (
                <div
                  className={`flex items-center justify-center py-3 ${isCollapsed ? '' : 'px-4'}`}
                >
                  {isCollapsed ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border/50 bg-background/50">
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 w-full px-3 py-2 rounded-md border border-dashed border-border/50 bg-background/50">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-normal">
                        No conversations yet
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {chats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={isCollapsed ? chat.title : undefined}
                          data-active={pathname === `/chat/${chat.id}`}
                          className={cn(
                            'transition-all hover:bg-primary/10 active:bg-primary/15',
                            pathname === `/chat/${chat.id}`
                              ? 'bg-secondary/60 hover:bg-secondary/60'
                              : ''
                          )}
                        >
                          <Link
                            href={`/chat/${chat.id}`}
                            className="flex items-center justify-between w-full gap-1"
                          >
                            <div className="flex items-center min-w-0 overflow-hidden flex-1 pr-2">
                              <MessageSquare
                                className={cn(
                                  'h-4 w-4 flex-shrink-0',
                                  pathname === `/chat/${chat.id}`
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                                )}
                              />
                              {!isCollapsed && (
                                <div className="ml-2 flex flex-col min-w-0 flex-1">
                                  <span
                                    className={cn(
                                      'truncate text-sm',
                                      pathname === `/chat/${chat.id}`
                                        ? 'text-foreground font-medium'
                                        : 'text-foreground/80'
                                    )}
                                    title={chat.title}
                                  >
                                    {chat.title}
                                  </span>
                                  {chat.updatedAt && (
                                    <span className="text-xs text-muted-foreground/70 truncate">
                                      {formatDate(chat.updatedAt)}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {!isCollapsed && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground flex-shrink-0"
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                title="Delete chat"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="relative my-2">
          <div className="absolute inset-x-0">
            <Separator className="w-full h-px bg-border/40" />
          </div>
        </div>

        <SidebarGroup className="flex-shrink-0">
          <SidebarGroupLabel
            className={cn(
              'px-4 pt-0 text-xs font-medium text-muted-foreground/80 uppercase tracking-wider',
              isCollapsed ? 'sr-only' : ''
            )}
          >
            MCP Servers
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setMcpSettingsOpen(true)}
                  className={cn(
                    'w-full flex items-center gap-2 transition-all',
                    'hover:bg-secondary/50 active:bg-secondary/70'
                  )}
                  tooltip={isCollapsed ? 'MCP Servers' : undefined}
                >
                  <ServerIcon
                    className={cn(
                      'h-4 w-4 flex-shrink-0',
                      activeServersCount > 0 ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex-grow text-sm text-foreground/80">MCP Servers</span>
                  )}
                  {activeServersCount > 0 && !isCollapsed ? (
                    <Badge
                      variant="secondary"
                      className="ml-auto text-[10px] px-1.5 py-0 h-5 bg-secondary/80"
                    >
                      {activeServersCount}
                    </Badge>
                  ) : activeServersCount > 0 && isCollapsed ? (
                    <SidebarMenuBadge className="bg-secondary/80 text-secondary-foreground">
                      {activeServersCount}
                    </SidebarMenuBadge>
                  ) : null}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/40 mt-auto">
        {/* <div className="flex flex-col gap-4 items-center">
                    {!isCollapsed && (
                        <p className="text-xs text-muted-foreground">
                        Built with{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://git.new/s-mcp"
                            className="text-primary hover:text-primary/80"
                        >
                            Scira Chat
                        </a>
                        </p>
                    )}
                </div> */}
        <div className={`flex flex-col ${isCollapsed ? 'items-center' : ''} gap-3`}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="default"
              className={cn(
                'w-full bg-primary text-primary-foreground hover:bg-primary/90',
                isCollapsed ? 'w-8 h-8 p-0' : ''
              )}
              onClick={handleNewChat}
              title={isCollapsed ? 'New Chat' : undefined}
            >
              <PlusCircle className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`} />
              {!isCollapsed && <span>New Chat</span>}
            </Button>
          </motion.div>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              {isCollapsed ? (
                <Button variant="ghost" className="w-8 h-8 p-0 flex items-center justify-center">
                  <Avatar className="h-6 w-6 rounded-lg bg-primary/20">
                    <AvatarFallback className="rounded-lg text-xs font-medium text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal bg-transparent border border-border/60 shadow-none px-2 h-10 hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 rounded-lg bg-primary/20">
                      <AvatarFallback className="rounded-lg text-sm font-medium text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid text-left text-sm leading-tight">
                      <span className="truncate font-medium text-foreground/90">
                        {userName || 'Guest'}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        CoffeeCorp Customer
                      </span>
                    </div>
                  </div>
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-lg"
              side={isCollapsed ? 'top' : 'top'}
              align={isCollapsed ? 'start' : 'end'}
              sideOffset={8}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg bg-primary/20">
                    <AvatarFallback className="rounded-lg text-sm font-medium text-primary">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-foreground/90">
                      {userName || 'Guest'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      CoffeeCorp Customer
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setEditUserNameOpen(true);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                  {userName ? 'Edit Name' : 'Set Your Name'}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setMcpSettingsOpen(true);
                  }}
                >
                  <Settings className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                  MCP Settings
                </DropdownMenuItem>
                {/* <DropdownMenuItem onSelect={(e) => {
                                    e.preventDefault();
                                    setApiKeySettingsOpen(true);
                                }}>
                                    <Key className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                                    API Keys
                                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    window.open('https://github.com/deepakkamboj/scira-mcp-ui-chat', '_blank');
                  }}
                >
                  <Github className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                  GitHub
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4 hover:text-sidebar-accent" />
                      Theme
                    </div>
                    <ThemeToggle className="h-6 w-6" />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <MCPServerManager
          servers={mcpServers}
          onServersChange={setMcpServers}
          selectedServers={selectedMcpServers}
          onSelectedServersChange={setSelectedMcpServers}
          open={mcpSettingsOpen}
          onOpenChange={setMcpSettingsOpen}
        />

        <ApiKeyManager open={apiKeySettingsOpen} onOpenChange={setApiKeySettingsOpen} />
      </SidebarFooter>

      <Dialog
        open={editUserNameOpen}
        onOpenChange={(open) => {
          setEditUserNameOpen(open);
          if (open) {
            setNewUserName(userName);
          }
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Enter Your Name</DialogTitle>
            <DialogDescription>
              Please enter your name so we can personalize your coffee ordering experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="e.g., Deepak Kamboj"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserNameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUserName}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
