<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:outline="http://wkhtmltopdf.org/outline"
                xmlns="http://www.w3.org/1999/xhtml">
    <xsl:output doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
                doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitiona
l.dtd"
                indent="yes" />
    <xsl:template match="outline:outline">
        <html>
            <head>
                <title>Table of Contents</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style>

            header {
                display: block;
            }

            .inline-title-logo {
                display: flex;
                justify-content: space-between;
            }

            .inline-title-logo p {
                font-variant: small-caps;
                color: red;
                font-weight: 400;
                letter-spacing: 1.5px;
                margin: 0;
            }

        .divider-x {
            border-bottom: 2px solid black;
            width: 100%;
            margin: 0;
            padding-top: 1em;
            left: 0;
        }
                    body {
                    letter-spacing: 1.2px;
                    font-family: Georgia, 'Times New Roman', Times, serif;
                    line-height: 2.6;
                    }
                    
        h1 {
            font-family: 'Courier New', Courier, monospace;
            font-size: 2.5em;
        }
                    div {border-bottom: 1px dashed rgb(200,200,200);}
                    span {float: right;}
                    li {
                        list-style: none;
                        padding-top: 2.5rem;
                    }
                    ul {
                    font-size: 20px;
                    }
                    ul ul {font-size: 80%; }
                    ul {padding-left: 0em;}
                    ul ul {padding-left: 1em;}
                    a {text-decoration:none; color: black;}
                </style>
            </head>
            <body>
        <header>
        <div class="inline-title-logo">
            <p>Table of Contents</p>
        </div>
        <div class="divider-x"></div>
        </header>
                <h1>Table of Contents</h1>
                <ul><xsl:apply-templates select="outline:item/outline:item"/></ul>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="outline:item">
        <li>
            <xsl:if test="@title!=''">
                <div>
                    <a>
                        <xsl:if test="@link">
                            <xsl:attribute name="href"><xsl:value-of select="@link"/></xsl:attribute>
                        </xsl:if>
                        <xsl:if test="@backLink">
                            <xsl:attribute name="name"><xsl:value-of select="@backLink"/></xsl:attribute>
                        </xsl:if>
                        <xsl:value-of select="@title" />
                    </a>
                    <span> <xsl:value-of select="@page" /> </span>
                </div>
            </xsl:if>
            <ul>
                <xsl:comment>added to prevent self-closing tags in QtXmlPatterns</xsl:comment>
                <xsl:apply-templates select="outline:item"/>
            </ul>
        </li>
    </xsl:template>
</xsl:stylesheet>