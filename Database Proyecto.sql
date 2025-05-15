USE [master]
GO
/****** Object:  Database [Proyecto]    Script Date: 5/14/2025 10:00:03 PM ******/
CREATE DATABASE [Proyecto]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Proyecto', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Proyecto.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Proyecto_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.SQLEXPRESS\MSSQL\DATA\Proyecto_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Proyecto] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Proyecto].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Proyecto] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Proyecto] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Proyecto] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Proyecto] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Proyecto] SET ARITHABORT OFF 
GO
ALTER DATABASE [Proyecto] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [Proyecto] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Proyecto] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Proyecto] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Proyecto] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Proyecto] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Proyecto] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Proyecto] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Proyecto] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Proyecto] SET  ENABLE_BROKER 
GO
ALTER DATABASE [Proyecto] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Proyecto] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Proyecto] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Proyecto] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Proyecto] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Proyecto] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Proyecto] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Proyecto] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Proyecto] SET  MULTI_USER 
GO
ALTER DATABASE [Proyecto] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Proyecto] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Proyecto] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Proyecto] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Proyecto] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Proyecto] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Proyecto] SET QUERY_STORE = ON
GO
ALTER DATABASE [Proyecto] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Proyecto]
GO
/****** Object:  User [Colon]    Script Date: 5/14/2025 10:00:03 PM ******/
CREATE USER [Colon] FOR LOGIN [Colon] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [Colon]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 5/14/2025 10:00:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[userId] [nvarchar](50) NOT NULL,
	[email] [nvarchar](100) NOT NULL,
	[password] [nvarchar](max) NOT NULL,
	[bio] [nvarchar](max) NULL,
	[deleted] [bit] NULL,
	[createdAt] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'Alam', N'colon@gmail.com', N'Bam', NULL, 0, CAST(N'2025-05-12T23:13:40.030' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'Colon', N'yandelcolon76@gmail.com', N'Bambam', NULL, 1, CAST(N'2025-05-13T15:47:08.637' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'Colon1', N'colon@gmail.com', N'Bambam', N'Hello', 0, CAST(N'2025-05-13T15:53:01.213' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'Hello', N'colon@gmail.com', N'Bambam', NULL, 0, CAST(N'2025-05-13T15:52:21.127' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'Juan', N'Juan64@gmail.com', N'Juanito64', N'Hello', 1, CAST(N'2025-05-13T20:11:31.823' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'Junior', N'Junior@gmail.com', N'Bambam', NULL, 1, CAST(N'2025-05-13T20:06:14.800' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'Junior1', N'Bambam@gmail.com', N'Bambam', NULL, 0, CAST(N'2025-05-13T20:10:26.203' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'y', N'yandelcolon@gmail.com', N'Bambam', NULL, 0, CAST(N'2025-05-13T20:07:36.327' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'Yandel', N'colon@gmail.com', N'Bambam', NULL, 0, CAST(N'2025-05-12T23:13:06.663' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'yandel1', N'yandelcolon76@gmail.com', N'Bambam', NULL, 1, CAST(N'2025-05-13T12:24:27.760' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'Yandel10', N'colonyandel8@gmail.com', N'Bambam', NULL, 1, CAST(N'2025-05-13T15:58:37.720' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'yandel19', N'yandelcolon76@gmail.com', N'Bambam', NULL, 0, CAST(N'2025-05-13T15:53:41.563' AS DateTime))
GO
INSERT [dbo].[Users] ([userId], [email], [password], [bio], [deleted], [createdAt]) VALUES (N'yandel193', N'yandelcolon76@gmail.com', N'Bambam', NULL, 1, CAST(N'2025-05-12T23:12:00.773' AS DateTime))
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [deleted]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [createdAt]
GO
USE [master]
GO
ALTER DATABASE [Proyecto] SET  READ_WRITE 
GO
