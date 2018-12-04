. $PSScriptRoot\Utility.ps1

# Get Vocabulary 

function Get-Definition ($word) {

    $document = Get-Html "https://en.oxforddictionaries.com/definition/us/$word"

    # defintion
    foreach ($definition in $document.getElementsByClassName("ind")) {
        $definitions += $definition.outerHtml -replace "SPAN", "p"
    }

    # example
    foreach ($example in $document.getElementsByClassName("examples")) {
        $sentences = @()
        foreach ($sentence in $example.getElementsByClassName("ex")) {
            $sentences += , $sentence.innerText -replace "[\u2018-\u2019]"
        }
        $examples += "<p>" + ($sentences | Sort-Object Length | Select-Object -Last 1) + "</p>"
    }

    # synonym
    $synonyms = "<p><b>Oxford&#a0;Dictionary</b></p>"
    foreach ($synonym in $document.getElementsByClassName("exs")) {
        $synonyms += $synonym.outerHtml
    }

    # etymology
    if ($document.querySelector(".etymology")) {
        $etymology = $document.querySelector(".etymology p").outerHTML
    }

    # get synonyms from the free dictionary if Oxford has not
    $document = Get-Html "https://www.thefreedictionary.com/$word"
    $synonyms += "`n<p><b>The&#a0;Free&#a0;Dictionary</b></p>`n<div class=syn>"
    foreach ($synonym in $document.querySelector("#ThesaurusInner").getElementsByClassName("Syn")) {
        if ($synonym.innerText -notmatch "," -or $synonym.innerText -match "=") { continue }
        $content = $synonym.innerText
        ($synonym.innerText -split ", ").ForEach{ 
            if ($synonyms -match ($_ -replace " \(.*?\)")) { $content = $content -replace " ?$($_)([ -]\w+)?,?" } 
        }
        $synonyms += ($content -replace " \(.*?\)") + ","
    }
    $synonyms = $synonyms.TrimEnd(",") + "</div>"
    $synonyms = $synonyms -replace "((?<=>)| )\w+([ -]\w+)+(,|(?=<))"
    $synonyms = $synonyms -replace ",(?=<)|<strong></strong>,? ?|(?<=syn>)," 
    $synonyms = $synonyms -replace "strong>", "b>" -replace ",{2,}", "," -replace ",(\w)", ", `$1"
    $synonyms = $synonyms -replace "<div.*exs`"></div>|<div class=syn>\(.*\)</div>|(?<=(`"|n)>) (?=\w+)"

    $etymology += "<p>"+$document.querySelector(".etyseg").innerHTML+"</p>"
    $etymology = $etymology -replace "<A.*?>(.*?)</A>", "<b>`$1</b>"
    $etymology = $etymology -replace "(<i.*?>.*?</i>)", "<b>`$1</b>"
    $etymology = $etymology -replace "<span.*?>(.*?)</span>", "`$1"

    #Add-Content "C:\github\gre\notes\test.html" "`n`n$word`n$synonyms`n$etymology"
    New-Object PSObject -Property @{ 
        word        = $word; 
        examples    = $examples; 
        definitions = $definitions; 
        synonyms    = $synonyms;
        etymology   = $etymology
    }

}

function Get-WordFamily ($word) {

    function Get-Children($Parent) {
        $words = @()
        $words = $members.Where{$_.Parent -eq $Parent}.Word
        if (!$words) { return }
        if ($Parent -eq $null) {$Parent = ""}
        foreach ($word in $words) {
            $global:family = $family.Insert(($family.IndexOf($Parent) + $Parent.Length), "<ul><li>$word</li></ul>")
            Get-Children $word
        }
    }

    $members = @()
    $html = Get-Html "https://www.vocabulary.com/dictionary/$word"
    $members = $html.querySelector("[data]").getAttribute("data") | ConvertFrom-Json
    $global:family = ""

    Get-Children $null
    <#if ($json) {
        
    }
    else {
        
        Write-Host "Manually create word family for $word"
        $ie = Invoke-InternetExplorer "https://www.vocabulary.com/dictionary/$word"
        $words = $ie.Document.IHTMLDocument3_getElementsByTagName("a").ForEach{ if ($_.className -like "*bar*" -and $_.innerText -notlike "the*family") {$_.innerText}}
        $words = $words | Sort-Object -Unique | Sort-Object Length
        $members += New-Object PSObject -Property @{ Word = $words[0]; Parent = ""}
        for ($i = 1; $i -lt $words.Count; $i++) {
            $j = 0
            do {
                $parent = @(($members.Where{$words[$i].Contains($_.Word.Substring(0, $_.Word.Length - $j))}.Word) | Sort-Object Length -Descending)[0]
                $j++
            }
            while (!$parent)
            $members += New-Object -Property PSObject @{ Word = $words[$i]; Parent = $parent}
        }
    }#>
    $family
}

$words = @()
$sets = ConvertFrom-Json ((Get-Content C:\github\js\literals\words.js -Raw) -replace "sets = ")
$id = "mp-example"
$name = (Get-Culture).TextInfo.ToTitleCase(($id -replace "-", " "))
$name = $name.Split(" ")[0].ToUpper() + " " + $name.Split(" ")[1]

$xml = [xml](Get-Content "C:\github\gre\notes\vocabulary.html")
$list = (Select-Xml "//div[@id=`"$id`"]" $xml).Node.InnerXml.Split(" ")
$set = New-Object PSObject -Property @{name = $name}

Set-Content "C:\github\gre\notes\test.html" ""

foreach ($word in $list) {
    if (!$word) { continue }
    Write-Host $word
    #$etymology = Get-Etymology $word 
    $family = Get-WordFamily $word
    $word = Get-Definition $word
    #$word.etymology += $etymology
    $word | Add-Member family $family
    $words += $word
}

$set | Add-Member words $words
if ($sets -and $sets.Name.Contains($set.Name)) { $sets[$sets.Name.IndexOf($set.Name)] = $set } 
else { $sets += , $set }

# format json to js
$content = "sets = " + (ConvertTo-Json $sets) 
$details = ($sets[0].words[0] | Get-Member -MemberType NoteProperty).Name
foreach ($detail in $details) { $content = $content -replace "$detail=", "`"$detail`"`:`"" }
$content = $content -replace ",`r`n\s+`"Count`".*`r`n}|{`r`n\s+`"value`":|\\u0026lt; "
$content = $content -replace "; `"", "`", `"" -replace "`"@{", "{" -replace "}`"", "`"}"
$content = $content -replace "`"(\w+)`":", "`$1:" -replace "\\u003e", ">" -replace "\\u003c", "<"
$content = $content -replace "\\u0027", "'"

Set-Content C:\github\js\literals\words.js $content -Encoding UTF8

<#
function Get-Etymology ($word) {
    $terms = @()
    $etymology = @()
    
    $uri = "https://en.wiktionary.org/wiki/$word"
    $html = Invoke-WebRequest $uri
    $document = $html.ParsedHtml.body
    $etymology = $document.getElementsByTagName("p") | ForEach-Object { if ($_.previousSibling.innerText -like "*Etymology*") { $_.innerHTML } }

    $xml = [xml](Get-Content "notes\affix.html")
    $nodes = $(Select-Xml "//tr" $xml).Node
    $maxPrefixString = ""
    $maxSuffixString = ""
    $maxPrefixIndex = 0
    $maxSuffixIndex = 0
    $maxPrefixLength = 0
    $maxSuffixLength = 0
    $etymologyes = "Prefix", "Suffix"
    for ($i = 1; $i -lt $nodes.Count; $i++) {
        
        $affix = $nodes[$i]
        $roots = $affix.ChildNodes[0].InnerText

        if ($affix.ChildNodes[0].InnerText.Contains("/")) {
            $roots = ""
            $array = $affix.ChildNodes[0].innerText.Split("/")
            for ($j = 0; $j -lt $array.Count; $j++) {
                if ($array[0].Trim(" ").StartsWith("-") -and !$array[$j].StartsWith("-")) { 
                    $array[$j] = "-" + $array[$j]
                }
                $roots += $array[$j] + ","
            }
        }
        $roots = $roots.Trim(" ").Split(", ")
        $roots.ForEach{
            $root = $_
            if (!$root -or $root -eq "-" -or $word.length -le $root.length) { return }
            $prefix = $word.Substring(0, $_.length)
            $suffix = $word.Substring($word.length - $root.length)
            for ($j = 0; $j -lt $affix.Count; $j++) {
                $affix = $affix[$j]
                if ( $root.StartsWith("-") -and $word.EndsWith($root.Trim("-")) -or $word.StartsWith($root.Trim("-"))) { 
                    if ( (Get-Variable "max$($affix)Length" -ValueOnly) -lt $root.length) {
                        Set-Variable "max$($affix)Length" $root.length
                        Set-Variable "max$($affix)Index"  $i
                        Set-Variable "max$($affix)String" "<p><b>$($affix[$j]):</b> $(Get-Variable $affix -ValueOnly)</p>" 
                    }
                }
            }
        }
    }

    for ($j = 0; $j -lt $affix.Count; $j++) {
        if ( !(Get-Variable $affix[$j] -ValueOnly) ) { continue }
        $etymology = $nodes[(Get-Variable "max$($affix[$j])Index" -ValueOnly)]
        $contents = "", "Meaning", "Example"
        for ($k = 1; $k -lt 3; $k++) {
            if (!(Get-Variable "max$($affix[$j])String" -ValueOnly)) {continue}
            Set-Variable "max$($affix[$j])String" "$(Get-Variable "max$($affix[$j])String" -ValueOnly)<p><b>$($contents[$k]):</b> $($etymology.ChildNodes[$k].InnerText)</p>"
        }
        $string += Get-Variable "max$($affix[$j])String" -ValueOnly
    }
    "<div class=`"etymology`">" + $string + $etymology + "</div>"
}
#>